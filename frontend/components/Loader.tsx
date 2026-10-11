"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

export default function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("sw-seen");
    const reduced = prefersReducedMotion();
    const dur = reduced ? 0.4 : seen ? 1.1 : 2.1;

    document.documentElement.classList.add("is-loading");

    const count = root.current!.querySelector<HTMLElement>(".loader__count-num")!;
    const fill = root.current!.querySelector<HTMLElement>(".loader__bar-fill")!;
    const panels = root.current!.querySelectorAll<HTMLElement>(".loader__panel");
    const fadeEls = root.current!.querySelectorAll<HTMLElement>(".loader__inner, .loader__count, .loader__tag");

    const counter = { v: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem("sw-seen", "1");
        document.documentElement.classList.remove("is-loading");
        document.documentElement.classList.add("is-loaded");
        window.dispatchEvent(new Event("site:loaded"));
        setDone(true);
      },
    });

    tl.to(counter, {
      v: 100,
      duration: dur,
      ease: "power2.inOut",
      onUpdate: () => {
        count.textContent = String(Math.round(counter.v));
        fill.style.transform = `scaleX(${counter.v / 100})`;
      },
    }).to(fadeEls, { opacity: 0, duration: 0.35, ease: "power1.in" }, ">-0.05")
      .to(panels, { yPercent: -100, duration: reduced ? 0.4 : 0.9, ease: "power4.inOut", stagger: 0.09 }, ">");

    return () => {
      tl.kill();
      document.documentElement.classList.remove("is-loading");
    };
  }, []);

  if (done) return null;

  return (
    <div className="loader" ref={root} aria-hidden>
      <div className="loader__panel loader__panel--trail" />
      <div className="loader__panel" />
      <div className="loader__inner">
        <div className="loader__kanji">SW</div>
        <div className="loader__bar">
          <div className="loader__bar-fill" />
        </div>
      </div>
      <div className="loader__count">
        <span className="loader__count-num">0</span>
        <sup>%</sup>
      </div>
      <div className="loader__tag">SAAD WASEEM · DEVOPS PORTFOLIO</div>
    </div>
  );
}
