"use client";

import { useEffect, useRef } from "react";
import { revealOnScroll, splitReveal } from "@/lib/gsap";

const STEPS = [
  {
    num: "01",
    verbEn: "Plan",
    desc: "Work out the requirements, the architecture and the cost before anything is built. Boring questions now prevent emergencies later.",
  },
  {
    num: "02",
    verbEn: "Build",
    desc: "Terraform modules, containers and pipelines. Everything is reproducible, nothing lives only on one laptop.",
  },
  {
    num: "03",
    verbEn: "Operate",
    desc: "Monitor, log, patch and back up. The goal is a stack so calm that silence is the normal state.",
  },
  {
    num: "04",
    verbEn: "Improve",
    desc: "Every incident becomes a written runbook, and every runbook becomes automation. Reviews without blame.",
  },
];

export default function Process() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current!;
    revealOnScroll(el);
    el.querySelectorAll<HTMLElement>("[data-split]").forEach((h) => splitReveal(h));
  }, []);

  return (
    <section className="process section" id="process" ref={root}>
      <div className="container">
        <div className="process__head">
          <span className="label" data-reveal>
            How I work
          </span>
          <h2 className="h-sec" style={{ marginTop: 22 }} data-split>
            Four steps, no mystery.
          </h2>
        </div>

        <div className="process__grid">
          {STEPS.map((s) => (
            <div className="process__step" key={s.num} data-reveal>
              <div className="process__num">Step {s.num}</div>
              <div className="process__verb-en">{s.verbEn}</div>
              <p className="process__desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
