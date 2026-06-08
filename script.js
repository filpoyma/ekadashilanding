/* ============================================================
   Ekadashi Calendar Alarm — landing scripts
   - AOS scroll animations
   - Subtle parallax tilt on the hero phones
   - Header shadow once the page scrolls
   - Current year in the footer
   ============================================================ */

(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- Email links (assembled in JS — not plain text in HTML) --
  document.querySelectorAll(".js-email").forEach((el) => {
    const u = el.dataset.u;
    const d = el.dataset.d;
    if (!u || !d) return;

    const email = `${u}@${d}`;
    const subject = el.dataset.subject;
    el.href = subject
      ? `mailto:${email}?subject=${encodeURIComponent(subject)}`
      : `mailto:${email}`;
    el.textContent = el.dataset.label || email;
  });

  // ---- AOS ----------------------------------------------------
  if (window.AOS) {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 60,
      disable: reduceMotion,
    });
  }

  // ---- Footer year -------------------------------------------
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- FAQ accordion (Anime.js) --------------------------------
  const initFaqAccordion = () => {
    document.querySelectorAll(".faq-item").forEach((item) => {
      const summary = item.querySelector("summary");
      const panel = item.querySelector(".faq-panel");
      if (!summary || !panel) return;

      let anim = null;

      const measurePanel = () => {
        panel.style.height = "auto";
        const height = panel.offsetHeight;
        panel.style.height = "0px";
        return height;
      };

      const setClosed = () => {
        item.removeAttribute("open");
        panel.style.height = "0px";
        panel.style.opacity = "0";
      };

      const setOpenStatic = () => {
        item.setAttribute("open", "");
        panel.style.height = "auto";
        panel.style.opacity = "1";
      };

      const openPanel = () => {
        if (anim) anime.remove(panel);

        item.setAttribute("open", "");
        panel.style.height = "0px";
        panel.style.opacity = "0";
        const targetHeight = measurePanel();
        panel.style.height = "0px";
        void panel.offsetHeight;

        if (reduceMotion || !window.anime) {
          setOpenStatic();
          return;
        }

        anim = anime({
          targets: panel,
          height: [0, targetHeight],
          opacity: [0, 1],
          duration: 360,
          easing: "easeOutCubic",
          complete: () => {
            panel.style.height = "auto";
            anim = null;
          },
        });
      };

      const closePanel = () => {
        if (anim) anime.remove(panel);

        const currentHeight = panel.offsetHeight;
        panel.style.height = `${currentHeight}px`;
        void panel.offsetHeight;

        if (reduceMotion || !window.anime) {
          setClosed();
          return;
        }

        anim = anime({
          targets: panel,
          height: [currentHeight, 0],
          opacity: [1, 0],
          duration: 280,
          easing: "easeInCubic",
          complete: () => {
            setClosed();
            anim = null;
          },
        });
      };

      summary.addEventListener("click", (e) => {
        e.preventDefault();
        if (item.hasAttribute("open")) closePanel();
        else openPanel();
      });

      if (item.hasAttribute("open")) {
        setOpenStatic();
      } else {
        setClosed();
      }
    });
  };

  initFaqAccordion();

  // ---- Header elevation on scroll ----------------------------
  let isSmoothScrolling = false;
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => {
      if (isSmoothScrolling) return;
      if (window.scrollY > 8) {
        header.style.boxShadow = "0 6px 20px rgba(45, 42, 36, 0.06)";
      } else {
        header.style.boxShadow = "none";
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // ---- Hero parallax tilt ------------------------------------
  if (!reduceMotion) {
    const heroVisual = document.querySelector(".hero-visual");
    const phoneBack = document.querySelector(".phone-back");
    const phoneFront = document.querySelector(".phone-front");

    if (heroVisual && phoneBack && phoneFront) {
      let rafId = null;

      const handleMove = (e) => {
        const rect = heroVisual.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;  // -1..1
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          phoneBack.style.transform =
            `translate(${-110 + x * -10}px, ${-10 + y * -8}px) rotate(${-8 + x * -2}deg)`;
          phoneFront.style.transform =
            `translate(${80 + x * 12}px, ${20 + y * 8}px) rotate(${6 + x * 2}deg)`;
        });
      };

      const reset = () => {
        if (rafId) cancelAnimationFrame(rafId);
        phoneBack.style.transform = "";
        phoneFront.style.transform = "";
      };

      heroVisual.addEventListener("mousemove", handleMove);
      heroVisual.addEventListener("mouseleave", reset);
    }
  }

  // ---- Smooth-scroll (Anime.js) ------------------------------
  // Native scroll-behavior / scrollIntoView are unreliable on iOS.
  // Anime.js animates a scroll proxy — smoother and cancellable.

  const scrollState = { y: 0 };
  let scrollAnim = null;

  const getScrollOffset = () => {
    const hdr = document.querySelector(".site-header");
    return hdr ? hdr.getBoundingClientRect().height + 12 : 0;
  };

  const getTargetY = (target) => {
    const offset = getScrollOffset();
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    return Math.max(0, Math.min(top, maxScroll));
  };

  const finishScroll = (targetY) => {
    isSmoothScrolling = false;
    scrollAnim = null;
    window.scrollTo(0, targetY);
    if (header) {
      header.style.boxShadow = targetY > 8
        ? "0 6px 20px rgba(45, 42, 36, 0.06)"
        : "none";
    }
  };

  const scrollToY = (targetY) => {
    const startY = window.scrollY;
    const distance = Math.abs(targetY - startY);
    if (distance < 2) return;

    if (reduceMotion || !window.anime) {
      finishScroll(targetY);
      return;
    }

    if (scrollAnim) anime.remove(scrollState);

    scrollState.y = startY;
    isSmoothScrolling = true;

    scrollAnim = anime({
      targets: scrollState,
      y: targetY,
      duration: Math.min(900, Math.max(420, distance * 0.55)),
      easing: "easeInOutCubic",
      round: 1,
      update: () => window.scrollTo(0, scrollState.y),
      complete: () => finishScroll(targetY),
    });
  };

  const scrollToElement = (target, updateHash) => {
    if (updateHash && target.id) {
      history.replaceState(null, "", `#${target.id}`);
    }
    scrollToY(getTargetY(target));
  };

  const handleAnchorNav = (e) => {
    const link = e.currentTarget;
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;
    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    scrollToElement(target, true);
  };

  document.querySelectorAll('a[href^="#"]:not(.js-email)').forEach((link) => {
    link.addEventListener("click", handleAnchorNav);
  });

  // Direct URL with hash (e.g. /#download) — wait for layout, then animate once.
  const initialHash = window.location.hash;
  if (initialHash) {
    const whenReady = Promise.all([
      new Promise((resolve) => {
        if (document.readyState === "complete") resolve();
        else window.addEventListener("load", resolve, { once: true });
      }),
      document.fonts?.ready ?? Promise.resolve(),
    ]);

    whenReady.then(() => {
      const target = document.querySelector(initialHash);
      if (!target) return;
      requestAnimationFrame(() => scrollToElement(target, false));
    });
  }
})();
