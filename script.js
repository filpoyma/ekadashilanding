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

  // ---- Header elevation on scroll ----------------------------
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => {
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

  // ---- Smooth-scroll for in-page links -----------------------
  // CSS scroll-behavior and scrollIntoView({ behavior: 'smooth' })
  // are unreliable on iOS Safari — use rAF-based animation instead.

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const getScrollOffset = () => {
    const header = document.querySelector(".site-header");
    return header ? header.getBoundingClientRect().height + 12 : 0;
  };

  const scrollToY = (targetY, duration = 750) => {
    const startY = window.scrollY;
    const distance = targetY - startY;
    if (Math.abs(distance) < 2) return;

    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startY + distance * easeOutCubic(progress));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const scrollToElement = (target) => {
    const offset = getScrollOffset();
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetY = Math.max(0, Math.min(top, maxScroll));

    if (reduceMotion) {
      window.scrollTo(0, targetY);
      return;
    }

    scrollToY(targetY);
  };

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      scrollToElement(target);
    });
  });

  // Hash in URL on load (e.g. index.html#features)
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      window.requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        window.requestAnimationFrame(() => scrollToElement(target));
      });
    }
  }
})();
