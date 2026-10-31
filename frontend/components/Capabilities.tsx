"use client";

import { useEffect, useRef } from "react";
import { revealOnScroll, splitReveal } from "@/lib/gsap";

const CARDS = [
  {
    idx: "01",
    title: "Cloud (AWS)",
    desc: "Production AWS: compute, storage, networking and secrets management I can stand behind when something goes wrong at night.",
    list: ["EC2", "S3", "RDS PostgreSQL", "ECR", "Route 53", "IAM", "CloudWatch", "Secrets Manager"],
  },
  {
    idx: "02",
    title: "DevOps & Automation",
    desc: "If I have to do it twice by hand, I turn it into a pipeline. Infrastructure and deploys written as code.",
    list: ["Terraform + S3 remote state", "Docker", "Docker Compose", "GitHub Actions CI/CD", "Git", "Bash"],
  },
  {
    idx: "03",
    title: "Linux & Web Servers",
    desc: "Boring servers on purpose: hardened, supervised, logged and easy to recover.",
    list: ["Ubuntu administration", "Nginx reverse proxy", "PM2", "Systemd", "SSH", "SSL/TLS Certbot", "DNS"],
  },
  {
    idx: "04",
    title: "Backend Development",
    desc: "The supporting layer: robust REST APIs other people can run, with typed contracts and JWT authentication.",
    list: ["Python", "Django", "Django REST Framework", "REST APIs", "JWT authentication", "Node.js", "TypeScript"],
  },
  {
    idx: "05",
    title: "Databases & Caching",
    desc: "Data modelled properly and served fast: ORM discipline, schema migrations and caching where it counts.",
    list: ["PostgreSQL", "Redis", "SQLite", "Django ORM", "Database migrations"],
  },
];

export default function Capabilities() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    revealOnScroll(root.current!);
    root.current!.querySelectorAll<HTMLElement>("[data-split]").forEach((h) =>
      splitReveal(h)
    );
  }, []);

  return (
    <section className="cap section" id="skills" ref={root}>
      <div className="container">
        <span className="label" data-reveal>
          Skills
        </span>
        <h2 className="h-sec" style={{ marginTop: 22, maxWidth: "20ch" }} data-split>
          The stack I work with.
        </h2>

        <div className="cap__grid" data-reveal>
          {CARDS.map((c) => (
            <article className="cap__card" key={c.idx}>
              <div>
                <div className="cap__top">
                  <span>{c.idx}</span>
                  <span>SAAD</span>
                </div>
                <h3>{c.title}</h3>
                <p className="cap__desc">{c.desc}</p>
              </div>
              <ul className="cap__list">
                {c.list.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
