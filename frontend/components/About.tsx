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
                and DevOps practitioner with hands-on freelance and remote
                development experience. I focus on operating Linux backends in
                production on AWS, writing infrastructure as code with
                Terraform, automating workflows through GitHub Actions CI/CD,
                and managing containerized deployments with Docker, Nginx, and
                Redis.
              </p>
              <p>
                My core expertise centers on cloud infrastructure, system
                reliability, and deployment automation, supported by a solid
                background in building APIs with Python and Django. I am
                currently expanding my experience as a Backend AI Engineer
                Intern at FlyRank AI while handling remote freelance deployment
                and engineering tasks.
              </p>
              <p>
                I am looking for Cloud, DevOps, or Backend engineering roles
                where I can contribute operational ownership and practical
                execution to a dynamic team, whether remote or on site in
                Lahore.
              </p>
            </div>
            <ul className="about__tools" data-reveal>
              <li>AWS</li>
              <li>Terraform</li>
              <li>Docker</li>
              <li>GitHub Actions</li>
              <li>Nginx</li>
              <li>PM2</li>
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
