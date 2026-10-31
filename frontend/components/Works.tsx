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
    desc: "Provisioned a complete, reproducible AWS infrastructure stack using Terraform: EC2, RDS PostgreSQL, ECR, Route 53 and security groups. Automated GitHub Actions CI/CD pipelines build container images, push them to Amazon ECR and deploy updates to EC2 on every code push using secure IAM roles.",
    chips: ["Terraform", "EC2", "RDS", "ECR", "Route 53"],
    href: "https://github.com/SenseiSaad/Saas_devops",
  },
  {
    idx: "02",
    title: "Modular REST API Backend",
    img: "/art/modular-desktop.png",
    mobileImg: "/art/modular-mobile.png",
    alt: "Diagram of the Django REST Framework API modules and Docker Compose services",
    tag: "Backend · REST API",
    year: "2026",
    role: "Design & build",
    stack: "Django REST Framework · Docker · PostgreSQL",
    desc: "Designed and developed a modular DRF API managing projects, work experience, logs and contact submissions to back this portfolio site. Fully containerized with Docker and Docker Compose to guarantee parity between local development and production environments.",
    chips: ["Django DRF", "PostgreSQL", "Docker", "Docker Compose"],
    href: "https://github.com/SenseiSaad/Portfolio-backend",
  },
  {
    idx: "03",
    title: "OpenVault",
    img: "/art/openvault-desktop.png",
    mobileImg: "/art/openvault-mobile.png",
    alt: "OpenVault web app shown in a browser window: enterprise document repository and AI knowledge platform",
    tag: "SaaS · AI Platform",
    year: "2026",
    role: "Backend & infrastructure",
    stack: "Next.js · Django DRF · PostgreSQL · Docker · AWS",
    desc: "Multi-tenant enterprise document repository and AI knowledge platform built with secure role-based access control, comprehensive audit logs and integrated RAG pipelines. Dockerized Django REST backend, deployed on AWS EC2.",
    chips: ["Next.js", "Django DRF", "PostgreSQL", "Docker", "AWS"],
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
            Three builds from 2026, each deployed and kept running. Scroll
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
