"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#about", en: "About" },
  { href: "#experience", en: "Experience" },
  { href: "#projects", en: "Projects" },
  { href: "#logs", en: "Logs" },
  { href: "#skills", en: "Skills" },
  { href: "#contact", en: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  // active section highlight
  useEffect(() => {
    const sections = LINKS.map((l) => document.querySelector(l.href)).filter(
      (s): s is Element => !!s
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          document.querySelectorAll(".nav__link").forEach((a) => {
            a.classList.toggle(
              "is-active",
              a.getAttribute("href") === `#${entry.target.id}`
            );
          });
        });
      },
      { rootMargin: "-42% 0px -52% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // lock scroll when menu open
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop(): void; start(): void } }).__lenis;
    if (open) lenis?.stop();
    else lenis?.start();
  }, [open]);

  return (
    <>
      <header className="nav" id="site-nav">
        <div className="nav__bar">
          <a href="#top" data-scroll-to="#top" className="nav__logo" aria-label="Saad Waseem, back to top">
            Saad Waseem
          </a>

          <nav className="nav__links" aria-label="Primary">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} data-scroll-to={l.href} className="nav__link">
                {l.en}
              </a>
            ))}
          </nav>

          <div className="nav__status">
            <i />
            Open to work
          </div>

          <button
            className={`nav__burger${open ? " is-open" : ""}`}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className={`mmenu${open ? " is-open" : ""}`} aria-hidden={!open}>
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            data-scroll-to={l.href}
            className="mmenu__link"
            onClick={() => setOpen(false)}
          >
            {l.en}
          </a>
        ))}
        <div className="mmenu__foot">
          <span>Lahore, PK</span>
          <span>obsks23@gmail.com</span>
        </div>
      </div>
    </>
  );
}
