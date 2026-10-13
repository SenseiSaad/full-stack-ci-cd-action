"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, revealOnScroll, splitReveal, prefersReducedMotion } from "@/lib/gsap";

const STATS = [
  { num: 2, suffix: "+", label: "Years hands-on" },
  { num: 10, suffix: "+", label: "Projects shipped" },
  { num: 5, suffix: "+", label: "Production servers run" },
  { num: 2027, suffix: "", label: "BSc CS, expected" },
];

export default function About() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current!;
    revealOnScroll(el);
    el.querySelectorAll<HTMLElement>("[data-split]").forEach((h) => splitReveal(h));

    // portrait slow parallax
    const img = el.querySelector<HTMLElement>(".about__frame img");
    if (img && !prefersReducedMotion()) {
      gsap.fromTo(
        img,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: "none",
          scrollTrigger: { trigger: ".about__frame", start: "top bottom", end: "bottom top", scrub: 1 },
        }
      );
    }

    // counters
    el.querySelectorAll<HTMLElement>(".stat__num").forEach((node) => {
      const target = Number(node.dataset.num ?? 0);
      const span = node.querySelector<HTMLElement>(".n")!;
      const counter = { v: 0 };
      if (prefersReducedMotion()) {
        span.textContent = String(target);
        return;
      }
      gsap.to(counter, {
        v: target,
        duration: 1.8,
        ease: "power2.out",
        scrollTrigger: { trigger: node, start: "top 88%" },
        onUpdate: () => {
          span.textContent = String(Math.round(counter.v));
        },
        onComplete: () => {
          span.textContent = String(target);
        },
      });
    });
  }, []);

  return (
    <section className="about section" id="about" ref={root}>
      <div className="container">
        <div className="about__grid">
          <div>
            <span className="label" data-reveal>
              About
            </span>
            <h2 className="h-sec about__head" data-split>
              I keep things online.
            </h2>
            <div className="about__body lead" data-reveal>
              <p>
                <span className="hi">Hi, I&rsquo;m Saad.</span> I&rsquo;m a cloud
                and DevOps engineer from Lahore. I run Linux backends in
                production on AWS, and I like them predictable: infrastructure
                you can rebuild from code, pipelines that deploy themselves, and
                clear steps to follow when something breaks.
              </p>
              <p>
                So far that has meant fixing out-of-memory builds on small
                servers, moving a live site to a new server with DNS and SSL
                handled over a weekend, wiring up Terraform and GitHub Actions
                end to end, and shipping Django and Node.js services other
                people can actually run. I&rsquo;m finishing a BSc in Computer
                Science (2027) and open to full-time and freelance work.
              </p>
            </div>
            <ul className="about__tools" data-reveal>
              <li>Terraform</li>
              <li>Docker</li>
              <li>GitHub Actions</li>
              <li>Nginx</li>
              <li>PM2</li>
              <li>PostgreSQL</li>
              <li>Redis</li>
              <li>Django</li>
              <li>React</li>
            </ul>
          </div>

          <div className="about__panel" data-reveal>
            <figure className="about__frame">
              <Image
                src="/art/About.jpeg"
                alt="Workspace file tree and architecture layout"
                width={736}
                height={920}
                priority={false}
              />
              <figcaption className="caption">
                <span>Workspace &amp; Architecture</span>
              </figcaption>
            </figure>
          </div>
        </div>

        <div className="about__stats" data-reveal>
          {STATS.map((s) => (
            <div className="stat" key={s.label}>
              <div className="stat__num" data-num={s.num} data-suffix={s.suffix}>
                <span className="n">0</span>
                <span className="plus">{s.suffix ? "+" : ""}</span>
              </div>
              <div className="stat__label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
