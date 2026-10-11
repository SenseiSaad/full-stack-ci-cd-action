"use client";

import { useEffect, useRef, useState } from "react";
import { revealOnScroll, splitReveal } from "@/lib/gsap";

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/SenseiSaad" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/saadwaseemcloud" },
  { label: "saadops.site", href: "https://saadops.site" },
];

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    revealOnScroll(root.current!);
    root.current!.querySelectorAll<HTMLElement>("[data-split]").forEach((h) =>
      splitReveal(h)
    );
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("obsks23@gmail.com");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = "obsks23@gmail.com";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section className="contact section" id="contact" ref={root}>
      <div className="container contact__inner">
        <span className="label" data-reveal>
          Contact
        </span>

        <h2 className="contact__title" data-split>
          Let&rsquo;s build and
          <br />
          deploy something.
        </h2>

        <button
          className="contact__mail"
          onClick={copyEmail}
          aria-label={copied ? "Email copied" : "Copy email address obsks23@gmail.com"}
          data-reveal
          data-reveal-delay="0.1"
        >
          obsks23@gmail.com
          <span className="copy">{copied ? "copied ✓" : "copy ⧉"}</span>
        </button>

        <div className="contact__socials" data-reveal data-reveal-delay="0.15">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel={s.href.startsWith("http") ? "noreferrer" : undefined}
              onClick={(e) => {
                if (s.href === "#") e.preventDefault();
              }}
            >
              {s.label}
            </a>
          ))}
        </div>

        <p className="contact__note" data-reveal data-reveal-delay="0.2">
          Open for full-time and freelance work, and usually replies within 24
          hours.
        </p>
      </div>
    </section>
  );
}
