"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current!;
    const word = el.querySelector<HTMLElement>(".footer__word");
    if (word && !prefersReducedMotion()) {
      gsap.fromTo(
        word,
        { yPercent: 42, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.4,
          ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        }
      );
    }
  }, []);

  return (
    <footer className="footer" ref={root}>
      <div className="footer__word" aria-hidden>
        SAAD
      </div>

      <div className="container">
        <div className="footer__grid">
          <div className="footer__col">
            <h4>Engineer</h4>
            <p>
              Saad Waseem, Cloud and DevOps engineer based in Lahore and working
              remote. AWS infrastructure, CI/CD pipelines and calm on-call.
            </p>
          </div>
          <div className="footer__col">
            <h4>Sitemap</h4>
            <ul>
              <li><a href="#top" data-scroll-to="#top">Top</a></li>
              <li><a href="#about" data-scroll-to="#about">About</a></li>
              <li><a href="#experience" data-scroll-to="#experience">Experience</a></li>
              <li><a href="#projects" data-scroll-to="#projects">Projects</a></li>
              <li><a href="#logs" data-scroll-to="#logs">Logs</a></li>
              <li><a href="#skills" data-scroll-to="#skills">Skills</a></li>
              <li><a href="#contact" data-scroll-to="#contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer__col">
            <h4>Elsewhere</h4>
            <ul>
              <li><a href="https://github.com/SenseiSaad" target="_blank" rel="noreferrer">GitHub</a></li>
              <li><a href="https://www.linkedin.com/in/saadwaseemcloud" target="_blank" rel="noreferrer">LinkedIn</a></li>
              <li>
                <a href="https://saadops.site" target="_blank" rel="noreferrer">
                  saadops.site
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__base">
          <span>© 2026 Saad Waseem</span>
          <span>Built with Next.js</span>
          <a
            href="#top"
            data-scroll-to="#top"
            className="footer__top"
            aria-label="Back to top"
          >
            Back to top
            <span className="circle">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
