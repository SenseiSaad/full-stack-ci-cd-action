"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { revealOnScroll, splitReveal } from "@/lib/gsap";

const PROJECTS = [
  {
    idx: "01",
    title: "OpenVault",
    img: "/art/legend-44.jpg",
    alt: "Cover image for OpenVault",
    tag: "SaaS · Backend",
    year: "2026",
    role: "Backend & Infrastructure",
    stack: "Django · PostgreSQL · Docker · AWS",
    desc: "A SaaS platform that lets companies share internal data with employees securely, with role-based access and audit logs. Dockerized Django backend.",
    chips: ["Django", "PostgreSQL", "Docker", "AWS"],
    href: "https://github.com/SenseiSaad/openvault",
  },
  {
    idx: "02",
    title: "Full-Stack CI/CD Pipeline",
    img: "/art/paris-rain.jpg",
    alt: "Cover image for the CI/CD pipeline project",
    tag: "DevOps · CI/CD",
    year: "2026",
    role: "Automation & Deployment",
    stack: "Django · AWS · GitHub Actions",
    desc: "A site that deploys itself. Every push to GitHub runs the build and ships it to AWS automatically, with no manual steps.",
    chips: ["GitHub Actions", "AWS", "Django", "Nginx"],
    href: "https://github.com/SenseiSaad/full-stack-ci-cd-action",
  },
  {
    idx: "03",
    title: "SaaS DevOps Infrastructure",
    img: "/art/rosso-ducati.jpg",
    alt: "Cover image for the DevOps infrastructure project",
    tag: "Infrastructure as Code",
    year: "2026",
    role: "Design & Provision",
    stack: "Terraform · AWS · HCL",
    desc: "The full AWS stack for a SaaS app, written in Terraform: compute, database, container registry and networking. Rebuildable from scratch.",
    chips: ["Terraform", "AWS", "IAM", "RDS"],
    href: "https://github.com/SenseiSaad/Saas_devops",
  },
];

export default function Works() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current!;
    revealOnScroll(el);
    el.querySelectorAll<HTMLElement>("[data-split]").forEach((h) => splitReveal(h));
  }, []);

  return (
    <section className="works section" id="projects" ref={root}>
      <div className="container">
        <div className="works__head">
          <div>
            <span className="label" style={{ color: "var(--sakura)" }} data-reveal>
              Selected projects
            </span>
            <h2 className="h-sec" style={{ marginTop: 22 }} data-split>
              Three builds,
              <br />
              in production.
            </h2>
          </div>
          <p className="note" data-reveal>
            Three builds from 2025–2026, each deployed and kept running. Scroll
            to flip through them.
          </p>
        </div>
      </div>

      <div className="works__stack">
        {PROJECTS.map((w, i) => (
          <div className="work-pin" key={w.idx} style={{ zIndex: i + 1 }}>
            <article className="work-screen">
              <Image
                className="work-screen__bg"
                src={w.img}
                alt={w.alt}
                fill
                sizes="100vw"
                priority={i === 0}
              />
              <div className="work-screen__scrim" aria-hidden />
              <div className="container work-screen__content">
                <span className="work-screen__tag">{w.tag}</span>
                <span className="work-screen__idx" aria-hidden>
                  {w.idx} / 03
                </span>
                <h3 className="work-screen__title">{w.title}</h3>
                <ul className="work-screen__meta">
                  <li><span className="k">Year</span><span className="v">{w.year}</span></li>
                  <li><span className="k">Role</span><span className="v">{w.role}</span></li>
                  <li><span className="k">Stack</span><span className="v">{w.stack}</span></li>
                </ul>
                <p className="work-screen__desc">{w.desc}</p>
                <div className="work-screen__chips">
                  {w.chips.map((c) => (
                    <span className="chip" key={c}>{c}</span>
                  ))}
                </div>
                <a
                  className="work-screen__link"
                  href={w.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  View on GitHub <span className="arr">→</span>
                </a>
              </div>
            </article>
          </div>
        ))}
      </div>

      <div className="container">
        <a className="works__all" href="/projects/" data-reveal>
          View all projects <span className="arr">→</span>
        </a>
      </div>
    </section>
  );
}
