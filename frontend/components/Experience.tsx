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
    org: "Celestial Church of Christ, Miracle Parish · Minnesota, US (remote)",
    icon: "code",
    tech: ["WordPress", "Responsive design", "DNS", "SSL", "Hosting"],
    description:
      "Built a 10+ page responsive website for a church organization in Minnesota: events, service schedules and media, with custom theme work. Set up the domain, hosting and SSL and handed over a site the team can maintain themselves.",
  },
  {
    year: "2026",
    period: "Jun 2026 – Aug 2026",
    role: "DevOps Engineer",
    org: "thinkwell · Freelance, remote (US client)",
    icon: "ops",
    tech: ["AWS EC2", "Docker", "Nginx", "PM2", "Redis"],
    description:
      "Ran a production Node.js backend on AWS: Docker, Nginx reverse proxy, PM2, Redis, SSL and DNS. Tracked down a recurring out-of-memory crash during builds on a 908 MB instance, migrated the server with an EC2 AMI snapshot at minimal downtime, and documented the deploy and recovery steps for the client.",
  },
  {
    year: "Now",
    period: "Aug 2026 – Present",
    role: "Backend AI Engineer (Intern)",
    org: "FlyRank AI · Remote",
    icon: "code",
    tech: ["Python", "Django / DRF", "REST APIs", "AWS"],
    description:
      "Building and maintaining backend services for an AI product: REST APIs and data flows, and supporting the cloud deployment. Working with the team to ship features and keep the backend reliable.",
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
