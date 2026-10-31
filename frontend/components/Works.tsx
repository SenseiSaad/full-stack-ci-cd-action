"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { revealOnScroll, splitReveal } from "@/lib/gsap";

const PROJECTS = [
  {
    idx: "01",
    title: "Cloud Infrastructure Automation",
    img: "/art/infra-desktop.png",
    mobileImg: "/art/infra-mobile.png",
    alt: "Diagram of the AWS stack: Route 53, EC2, RDS PostgreSQL, with Terraform, ECR and S3 around them",
    tag: "Infrastructure as Code",
    year: "2026",
    role: "Design & provision",
    stack: "Terraform · AWS · GitHub Actions",
    desc: "The full AWS stack for a SaaS app written in Terraform: EC2, RDS PostgreSQL, ECR, Route 53 and security groups — reproducible from scratch. GitHub Actions builds container images, pushes them to Amazon ECR and deploys to EC2 on every push, with credentials in encrypted secrets and IAM roles.",
    chips: ["Terraform", "EC2", "RDS", "ECR", "Route 53"],
    href: "https://github.com/SenseiSaad/Saas_devops",
  },
  {
    idx: "02",
    title: "Full-Stack CI/CD Pipeline",
    img: "/art/cicd-desktop.png",
    mobileImg: "/art/cicd-mobile.png",
    alt: "Pipeline diagram: git push, GitHub Actions build and test, Docker image to Amazon ECR, deploy to EC2",
    tag: "DevOps · CI/CD",
    year: "2026",
    role: "Automation & deployment",
    stack: "GitHub Actions · Docker · AWS",
    desc: "A site that deploys itself. Every push runs the pipeline — install, type-check, tests — then builds the container, pushes it to Amazon ECR and ships it to EC2. No manual steps, no forgotten servers.",
    chips: ["GitHub Actions", "Docker", "AWS", "Nginx"],
    href: "https://github.com/SenseiSaad/full-stack-ci-cd-action",
  },
  {
    idx: "03",
    title: "OpenVault",
    img: "/art/openvault-desktop.png",
    mobileImg: "/art/openvault-mobile.png",
    alt: "OpenVault web app shown in a browser window: private company knowledge platform",
    tag: "SaaS · Backend",
    year: "2026",
    role: "Backend & infrastructure",
    stack: "Django · PostgreSQL · Docker · AWS",
    desc: "A SaaS platform that lets companies share internal knowledge with employees securely, with role-based access and audit logs. Dockerized Django REST backend, deployed on AWS EC2.",
    chips: ["Django", "PostgreSQL", "Docker", "AWS"],
    href: "https://github.com/SenseiSaad/openvault",
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
              {w.mobileImg ? (
                <>
                  <Image
                    className="work-screen__bg work-screen__bg--desktop"
                    src={w.img}
                    alt={w.alt}
                    fill
                    sizes="100vw"
                    priority={i === 0}
                  />
                  {/* mobile: framed card in flow (see .work-screen__art) */}
                  <div className="work-screen__art">
                    <Image
                      src={w.mobileImg}
                      alt={w.alt}
                      width={750}
                      height={520}
                      priority={i === 0}
                    />
                  </div>
                </>
              ) : (
                <Image
                  className="work-screen__bg"
                  src={w.img}
                  alt={w.alt}
                  fill
                  sizes="100vw"
                  priority={i === 0}
                />
              )}
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
