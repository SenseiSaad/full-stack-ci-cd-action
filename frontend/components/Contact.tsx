"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { revealOnScroll, splitReveal } from "@/lib/gsap";

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/SenseiSaad" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/saadwaseemcloud" },
  { label: "saadops.site", href: "https://saadops.site" },
];

const WEB3FORMS_KEY = "0dac0979-7e24-4339-8cb3-be892884bb3f";

type Status = "idle" | "sending" | "success" | "error";

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

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

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // honeypot: bots fill this hidden field; quietly succeed if they do
    if (data.get("botcheck")) {
      setStatus("success");
      setMessage("Message sent, thank you.");
      form.reset();
      return;
    }

    setStatus("sending");
    setMessage("Sending\u2026");

    try {
      const body: Record<string, string> = {
        access_key: WEB3FORMS_KEY,
        name: (data.get("name") as string) ?? "",
        email: (data.get("email") as string) ?? "",
        subject: (data.get("subject") as string) ?? "",
        message: (data.get("message") as string) ?? "",
      };
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as { success?: boolean; message?: string };
      if (json.success) {
        setStatus("success");
        setMessage("Message sent. Thank you, I will get back to you soon.");
        form.reset();
      } else {
        setStatus("error");
        setMessage(json.message ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Could not reach the server. Please try again in a moment.");
    }
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

        <form className="contact__form" onSubmit={submit} data-reveal data-reveal-delay="0.2">
          <input
            type="checkbox"
            name="botcheck"
            className="contact__hp"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />
          <div className="contact__form-row">
            <div className="contact__field">
              <label htmlFor="contact-name">Name</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                placeholder="Your name"
                required
                autoComplete="name"
              />
            </div>
            <div className="contact__field">
              <label htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>
          </div>
          <div className="contact__field">
            <label htmlFor="contact-subject">Subject</label>
            <input
              id="contact-subject"
              name="subject"
              type="text"
              placeholder="What is this about?"
              required
            />
          </div>
          <div className="contact__field">
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              name="message"
              placeholder="Tell me a little about your project."
              required
            />
          </div>

          {status !== "idle" && (
            <p
              className={`contact__form-status contact__form-status--${status}`}
              role="status"
            >
              {message}
            </p>
          )}

          <button
            className="btn btn--solid contact__form-submit"
            type="submit"
            disabled={status === "sending"}
          >
            {status === "sending" ? "Sending\u2026" : "Send message"}
          </button>
        </form>

        <div className="contact__socials" data-reveal data-reveal-delay="0.25">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel={s.href.startsWith("http") ? "noreferrer" : undefined}
            >
              {s.label}
            </a>
          ))}
        </div>

        <p className="contact__note" data-reveal data-reveal-delay="0.3">
          Open for full-time and freelance work, and usually replies within 24
          hours.
        </p>
      </div>
    </section>
  );
}
