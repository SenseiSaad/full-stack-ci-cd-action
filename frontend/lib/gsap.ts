import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Splits an element's text into individually animatable characters,
 * grouped into word wrappers so line-breaking stays word-safe.
 * Preserves <br> and nested inline elements (e.g. accent spans).
 */
export function splitToChars(el: HTMLElement): HTMLElement[] {
  if (el.dataset.split === "done") {
    return Array.from(el.querySelectorAll<HTMLElement>(".c"));
  }
  el.classList.add("split");
  const chars: HTMLElement[] = [];

  const process = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? "";
      if (!text.trim()) return;
      const frag = document.createDocumentFragment();
      const words = text.split(/(\s+)/).filter((w) => w.length > 0);
      for (const word of words) {
        if (/^\s+$/.test(word)) {
          frag.appendChild(document.createTextNode(" "));
          continue;
        }
        const w = document.createElement("span");
        w.className = "word";
        for (const ch of Array.from(word)) {
          const box = document.createElement("span");
          box.className = "w";
          const c = document.createElement("span");
          c.className = "c";
          c.textContent = ch;
          box.appendChild(c);
          w.appendChild(box);
          chars.push(c);
        }
        frag.appendChild(w);
      }
      (node as ChildNode).replaceWith(frag);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const eln = node as HTMLElement;
      if (eln.tagName === "BR") return;
      Array.from(eln.childNodes).forEach(process);
    }
  };

  Array.from(el.childNodes).forEach(process);
  el.dataset.split = "done";
  return chars;
}

/** Fade/slide reveal driven by ScrollTrigger. */
export function revealOnScroll(
  scope: HTMLElement | Document,
  selector = "[data-reveal]",
  opts?: { stagger?: number; y?: number; start?: string }
) {
  const els = (scope as HTMLElement).querySelectorAll<HTMLElement>(selector);
  if (!els.length) return;
  const reduced = prefersReducedMotion();
  els.forEach((el) => {
    const delay = parseFloat(el.dataset.revealDelay ?? "0");
    if (reduced) {
      el.style.opacity = "1";
      return;
    }
    gsap.fromTo(
      el,
      { opacity: 0, y: opts?.y ?? 44 },
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: opts?.start ?? "top 86%",
        },
      }
    );
  });
}

/** Character-by-character heading reveal on scroll. */
export function splitReveal(el: HTMLElement, trigger?: HTMLElement, opts?: { delay?: number }) {
  const chars = splitToChars(el);
  if (prefersReducedMotion()) return;
  gsap.set(chars, { yPercent: 115 });
  gsap.to(chars, {
    yPercent: 0,
    duration: 0.9,
    delay: opts?.delay ?? 0,
    ease: "power4.out",
    stagger: 0.028,
    scrollTrigger: {
      trigger: trigger ?? el,
      start: "top 85%",
    },
  });
}
