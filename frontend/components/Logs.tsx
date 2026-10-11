"use client";

import { useEffect, useRef } from "react";
import { revealOnScroll, splitReveal } from "@/lib/gsap";
import { LOGS } from "./logs-data";

export { LOGS };

export default function Logs() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    revealOnScroll(root.current!);
    root.current!.querySelectorAll<HTMLElement>("[data-split]").forEach((h) =>
      splitReveal(h)
    );
  }, []);

  return (
    <section className="logs section" id="logs" ref={root}>
      <div className="container">
        <div className="logs__head">
          <div>
            <span className="label" data-reveal>
              Logs
            </span>
            <h2 className="h-sec" style={{ marginTop: 22 }} data-split>
              Notes from the terminal.
            </h2>
          </div>
          <p className="note" data-reveal>
            Short write-ups on real problems I ran into and how I solved them.
          </p>
        </div>

        <div className="logs__grid" data-reveal>
          {LOGS.map((l) => (
            <article className="log-card" key={l.title}>
              <div className="log-card__top">
                <span className="log-card__tag">{l.tag}</span>
                <span className="log-card__date">{l.date}</span>
              </div>
              <h3 className="log-card__title">{l.title}</h3>
              <p className="log-card__summary">{l.summary}</p>
              <a className="log-card__link" href="/logs/">
                Read <span className="arr">→</span>
              </a>
            </article>
          ))}
        </div>

        <a className="logs__all" href="/logs/" data-reveal>
          Read all logs <span className="arr">→</span>
        </a>
      </div>
    </section>
  );
}
