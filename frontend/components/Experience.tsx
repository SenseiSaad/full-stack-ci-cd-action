"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { revealOnScroll, splitReveal } from "@/lib/gsap";

type Job = {
  year: string;
  period: string;
  role: string;
  org: string;
  icon: "ops" | "code";
  tech: string[];
  description: string;
  img?: string;
  alt?: string;
};

// Oldest first so the timeline reads left -> right, with the current role on
// the right (and selected by default). `img` is optional: leave it unset to
// show the labelled placeholder, drop a file in /public/art and point to it to
// swap in a real photo/screenshot.
const JOBS: Job[] = [
  {
    year: "2024",
    period: "Jun 2024 – Aug 2024",
    role: "Freelance Web Developer",
    org: "Celestial Church of Christ Miracle Parish · Minnesota, US",
    icon: "code",
    tech: ["WordPress", "Responsive design", "Hosting", "DNS"],
    description:
      "Built a multi-page responsive web solution for an organization in the United States: over 10 responsive pages covering church events, staff directories and dynamic content, with theme optimization, hosting setup and DNS configuration.",
    img: "/art/work_exp1.png",
    alt: "Celestial Church of Christ, Miracle Parish website project",
  },
  {
    year: "2025",
    period: "Mar 2025",
    role: "Front-End Web Developer (Freelance)",
    org: "Game Project · Pakistan",
    icon: "code",
    tech: ["HTML · CSS", "JavaScript", "3D runtime (iframe)", "Responsive layouts"],
    description:
      "Developed a single-page interactive game website designed for browser play: integrated an in-browser 3D game runtime using an iframe, handled front-end animations and optimized responsive layouts across devices.",
  },
  {
    year: "2026",
    period: "Jun 2026 – Aug 2026",
    role: "DevOps & Backend Engineer",
    org: "ThinkWell / Healthcare Clinic Web Platform · Remote, US client",
    icon: "ops",
    tech: ["AWS EC2 (Ubuntu)", "Nginx", "PM2", "Redis", "Certbot · DNS"],
    description:
      "Operated a production Node.js and TypeScript backend on an AWS EC2 Ubuntu instance: Nginx reverse proxy, PM2 supervision, Redis, SSL/TLS certificates with Certbot and DNS records. Resolved out-of-memory build failures on a 908 MB server by adjusting compilation strategies, traced startup errors through logs to fix entry path configuration, migrated the server with AWS AMI snapshots and sequenced DNS and SSL cutovers to minimize downtime, and documented deployment and recovery steps for client handoff.",
  },
  {
    year: "Now",
    period: "Aug 2026 – Present",
    role: "Backend AI Engineer (Intern)",
    org: "FlyRank AI · Remote",
    icon: "code",
    tech: ["Python", "Django / DRF", "REST APIs", "Cloud deployments"],
    description:
      "Contributing to backend integration, data flows and AI product engineering within a remote team: building and maintaining backend services, writing robust REST APIs and supporting cloud deployments to ensure high reliability.",
    img: "/art/work_exp3.png",
    alt: "FlyRank AI Backend internship platform",
  },
];

function Icon({ kind }: { kind: Job["icon"] }) {
  if (kind === "ops") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M3 13h18" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="m8 9-3 3 3 3" />
      <path d="m16 9 3 3-3 3" />
      <path d="m13 7-2 10" />
    </svg>
  );
}

export default function Experience() {
  const root = useRef<HTMLElement>(null);
  // Default to the most recent role (right-most node).
  const [active, setActive] = useState(JOBS.length - 1);

  useEffect(() => {
    revealOnScroll(root.current!);
    root.current!.querySelectorAll<HTMLElement>("[data-split]").forEach((h) =>
      splitReveal(h)
    );
  }, []);

  const job = JOBS[active];

  return (
    <section className="exp section" id="experience" ref={root}>
      <div className="container">
        <span className="label" data-reveal>
          Experience
        </span>
        <h2 className="h-sec" style={{ marginTop: 22 }} data-split>
          Where I&rsquo;ve worked.
        </h2>
        <p className="note" data-reveal style={{ marginTop: 14 }}>
          A timeline, oldest to most recent. Pick a point to see the role.
        </p>

        <div className="extl" data-reveal>
          <div className="extl__track" role="tablist" aria-label="Work history">
            {JOBS.map((j, i) => (
              <button
                key={j.period}
                className={`extl__node${i === active ? " is-active" : ""}`}
                role="tab"
                aria-selected={i === active}
                aria-label={`${j.role}, ${j.period}`}
                onClick={() => setActive(i)}
                type="button"
              >
                <span className="extl__dot">
                  <Icon kind={j.icon} />
                </span>
                <span className="extl__year">{j.year}</span>
              </button>
            ))}
          </div>

          <div className="extl__detail" key={active} role="tabpanel">
            <div className="extl__detail-body">
              <span className="extl__detail-time">{job.period}</span>
              <h3 className="extl__detail-title">{job.role}</h3>
              <p className="extl__detail-org">{job.org}</p>
              <ul className="extl__detail-tech">
                {job.tech.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <p className="extl__detail-desc">{job.description}</p>
            </div>

            <div className="extl__detail-media" aria-hidden={!job.img}>
              {job.img ? (
                <Image src={job.img} alt={job.alt ?? job.role} fill sizes="(max-width: 920px) 100vw, 40vw" />
              ) : (
                <div className="extl__detail-ph">
                  <span className="extl__detail-ph-icon">
                    <Icon kind={job.icon} />
                  </span>
                  <span className="extl__detail-ph-text">{job.year}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
