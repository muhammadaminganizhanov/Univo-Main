"use client";

import { useEffect } from "react";

/**
 * Motion foundation. The head script adds `html.motion` (only without reduced motion); this marks
 * every [data-scene] with data-in when it first enters the viewport. CSS does the rest.
 * No library, no scroll hijacking, nothing runs continuously. A later motion pass can replace
 * this with a scroll-driven timeline without touching markup.
 */
export function MotionRoot() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("motion-ready");
    if (!root.classList.contains("motion")) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-in", "");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );
    const observe = () => document.querySelectorAll("[data-scene]:not([data-in])").forEach((el) => io.observe(el));
    observe();
    // Client navigations render new scenes; pick them up.
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}

/** Runs before paint: enable motion only for people who did not ask for less. Fail-safe after 2.5 s. */
export const MOTION_HEAD_SCRIPT = `(function(){try{var d=document.documentElement;if(window.matchMedia&&!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('motion');setTimeout(function(){if(!d.classList.contains('motion-ready'))d.classList.remove('motion')},2500)}}catch(e){}})();`;
