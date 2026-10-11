"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // progress bar + nav solid state are driven here via CSS vars / events
    const progress = document.getElementById("scroll-progress");
    const nav = document.getElementById("site-nav");
    let lastY = 0;

    lenis.on("scroll", ({ scroll, limit }: { scroll: number; limit: number }) => {
      const p = limit > 0 ? scroll / limit : 0;
      if (progress) progress.style.transform = `scaleX(${p})`;
      if (nav) {
        nav.classList.toggle("is-solid", scroll > 40);
        // hide on scroll down, show on scroll up (past hero)
        if (scroll > 140 && scroll > lastY + 4) nav.classList.add("is-hidden");
        else if (scroll < lastY - 4 || scroll <= 140) nav.classList.remove("is-hidden");
      }
      lastY = scroll;
    });

    // anchor scrolling via delegation — works for nav, hero CTAs, footer
    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>("[data-scroll-to]");
      if (!target) return;
      e.preventDefault();
      const sel = target.dataset.scrollTo!;
      const el = document.querySelector(sel);
      if (!el) return;
      // let the mobile menu close first if it was open
      window.setTimeout(() => lenis.scrollTo(el as HTMLElement, { duration: 1.6 }), 60);
    };
    document.addEventListener("click", onClick);

    // refresh triggers once everything (fonts, images) has settled
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(raf);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return (
    <div
      id="scroll-progress"
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: "var(--verm)",
        transform: "scaleX(0)",
        transformOrigin: "left",
        zIndex: 55,
        pointerEvents: "none",
      }}
    />
  );
}
