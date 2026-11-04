"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, revealOnScroll, splitReveal, prefersReducedMotion } from "@/lib/gsap";

const STATS = [
  { num: 2, suffix: "+", label: "Years experience" },
  { num: 5, suffix: "+", label: "Projects shipped" },
  { num: 2, suffix: "+", label: "Live deployments" },
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
                <span className="hi">Hi, I&rsquo;m Saad.</span> Cloud and DevOps
                engineer deploying Linux applications on AWS with Terraform
                and GitHub Actions, and resolving production incidents from
                out-of-memory builds to EC2 migrations with DNS and SSL
                cutover. Currently a Backend AI Engineer Intern at FlyRank AI,
                open to
                Cloud and DevOps roles, remote or on site in Lahore.
              </p>
            </div>
            <ul className="about__tools" data-reveal>
              <li>AWS</li>
              <li>Terraform</li>
              <li>Docker</li>
              <li>GitHub Actions</li>
              <li>Nginx</li>
              <li>PostgreSQL</li>
              <li>Redis</li>
              <li>Django</li>
            </ul>
          </div>

          <div className="about__panel" data-reveal>
            <figure className="about__frame">
              <Image
                src="/art/About.jpeg"
                alt="VS Code file tree of a project with Terraform modules, GitHub Actions workflows and Docker files"
                width={1000}
                height={1792}
                priority={false}
              />
              <figcaption className="caption">
                <span>IaC &amp; CI/CD project tree</span>
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
