"use client";

import { CSSProperties } from "react";

type Item = { en: string; jp?: string };

export default function Marquee({
  items,
  variant = "verm",
  reverse = false,
  duration = 26,
  className = "",
  style,
}: {
  items: Item[];
  variant?: "verm" | "ink" | "paper";
  reverse?: boolean;
  duration?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const group = (key: string) => (
    <div className="marquee__group" key={key}>
      {items.map((it, i) => (
        <span className="marquee__item" key={i}>
          <span className="star">✦</span> {it.en}
          {it.jp && <span className="jp">{it.jp}</span>}
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={`marquee marquee--${variant}${reverse ? " marquee--rev" : ""} ${className}`}
      style={style}
      role="presentation"
    >
      <div className="marquee__track" style={{ "--marq-dur": `${duration}s` } as CSSProperties}>
        {group("a")}
        {group("b")}
      </div>
    </div>
  );
}
