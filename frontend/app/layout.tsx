import type { Metadata, Viewport } from "next";

// Self-hosted fonts (Fontsource) — no runtime requests to Google Fonts.
import "@fontsource/zen-old-mincho/400.css";
import "@fontsource/zen-old-mincho/700.css";
import "@fontsource/zen-old-mincho/900.css";
import "@fontsource/zen-kaku-gothic-new/400.css";
import "@fontsource/zen-kaku-gothic-new/500.css";
import "@fontsource/zen-kaku-gothic-new/700.css";
import "@fontsource/zen-kaku-gothic-new/900.css";
import "@fontsource/syne/400.css";
import "@fontsource/syne/500.css";
import "@fontsource/syne/600.css";
import "@fontsource/syne/700.css";
import "@fontsource/syne/800.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";

import "./globals.css";

export const metadata: Metadata = {
  title: "Saad Waseem · Cloud / DevOps Engineer",
  description:
    "Portfolio of Saad Waseem, a Cloud and DevOps engineer who keeps Linux backends running on AWS using Terraform, GitHub Actions, Docker, Nginx, PostgreSQL and Django.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
