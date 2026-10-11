"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, splitToChars, prefersReducedMotion } from "@/lib/gsap";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [pkt, setPkt] = useState("");

  // live Lahore clock
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Karachi",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setPkt(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  // intro choreography, runs when the loader finishes
  useEffect(() => {
    const start = () => {
      const q = gsap.utils.selector(root);
      const reduced = prefersReducedMotion();
      if (reduced) {
        gsap.set(q("[data-hero]"), { opacity: 1, y: 0 });
        return;
      }

      const line1 = splitToChars(q<HTMLElement>(".hero__title .l1")[0]);
      const line2 = splitToChars(q<HTMLElement>(".hero__title .l2")[0]);

      gsap.set(q("[data-hero]"), { opacity: 0, y: 26 });
      gsap.set([...line1, ...line2], { yPercent: 118 });

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.to(line1, { yPercent: 0, duration: 1.15, stagger: 0.045 }, 0.1)
        .to(line2, { yPercent: 0, duration: 1.15, stagger: 0.045 }, 0.28)
        .to(q(".hero__kicker"), { opacity: 1, y: 0, duration: 0.9 }, 0.5)
        .to(q(".hero__sub"), { opacity: 1, y: 0, duration: 0.9 }, 0.85)
        .to(q(".hero__cta"), { opacity: 1, y: 0, duration: 0.9 }, 1)
        .to(q(".hero__bottom"), { opacity: 1, y: 0, duration: 0.9 }, 1.1);
    };

    if (document.documentElement.classList.contains("is-loaded")) {
      start();
      return;
    }
    window.addEventListener("site:loaded", start, { once: true });
    const fallback = window.setTimeout(start, 4500); // safety net
    return () => {
      window.removeEventListener("site:loaded", start);
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <section className="hero" id="top" ref={root}>
      <div className="hero__kicker label" data-hero>
        Portfolio © 2026 · Cloud / DevOps Engineer
      </div>

      <div className="hero__title-wrap">
        <h1 className="hero__title">
          <span className="l1">SAAD</span>
          <span className="l2">WASEEM</span>
        </h1>

        <p className="hero__sub" data-hero>
          I&rsquo;m a Lahore-based <em>Cloud &amp; DevOps engineer</em>. I keep
          Linux backends running in production on AWS, using Terraform, Docker,
          Nginx and CI/CD pipelines, with Django and TypeScript in the toolbox.
          In plain terms: I set servers up, keep them online, and make deploys
          boring and repeatable.
        </p>

        <div className="hero__cta" data-hero>
          <a href="#projects" data-scroll-to="#projects" className="btn btn--solid">
            View projects <span className="arrow">→</span>
          </a>
          <a href="#contact" data-scroll-to="#contact" className="btn">
            Get in touch
          </a>
        </div>
      </div>

      <div className="hero__bottom" data-hero>
        <span className="hero__scroll">
          Scroll <span className="line" />
        </span>
        <span>Lahore, Pakistan</span>
        <span>PKT {pkt || "--:--:--"}</span>
      </div>
    </section>
  );
}
