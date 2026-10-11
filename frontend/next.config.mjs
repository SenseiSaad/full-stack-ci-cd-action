/** @type {import('next').NextConfig} */
const nextConfig = {
  // Strict Mode double-invokes effects in dev, which made GSAP/Lenis/Loader
  // init twice (the "page loads twice" symptom). Off so dev matches prod.
  reactStrictMode: false,

  // Ship a fully static site (no server runtime) so AWS Amplify can host it as
  // plain files on CDN — cheapest/simplest for a DB-less portfolio. `npm run
  // build` writes the site to ./out. Dev (`npm run dev`) is unaffected.
  output: "export",

  // Static export has no image optimization server, so next/image serves the
  // original files directly.
  images: { unoptimized: true },

  // Emit each route as a folder with index.html (/projects -> /projects/index.html)
  // so a plain static host resolves clean URLs without rewrite rules.
  trailingSlash: true,
};

export default nextConfig;
