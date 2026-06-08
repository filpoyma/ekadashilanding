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

  // ---- Smooth-scroll for in-page links (graceful fallback) ---
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  });
})();
