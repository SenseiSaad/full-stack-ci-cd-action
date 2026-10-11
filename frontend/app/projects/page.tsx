import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "Projects · Saad Waseem",
  description: "Full list of projects by Saad Waseem.",
};

const PROJECTS = [
  { name: "OpenVault", stack: "Django · PostgreSQL · Docker · AWS", desc: "SaaS platform for companies to share internal data with employees securely, with role-based access and auditing.", repo: "openvault" },
  { name: "Full-Stack CI/CD Pipeline", stack: "Django · AWS · GitHub Actions", desc: "Portfolio site with a Django backend and static front end that builds and deploys itself on every push.", repo: "full-stack-ci-cd-action" },
  { name: "SaaS DevOps Infrastructure", stack: "Terraform · AWS · HCL", desc: "Complete AWS infrastructure for a SaaS app, defined entirely as code and rebuildable from scratch.", repo: "Saas_devops" },
  { name: "Showroom", stack: "Python · Django", desc: "Backend for a vehicle website with login, specs, and replica pricing and tax information.", repo: "Showroom" },
  { name: "Apothecary", stack: "TypeScript · Node.js", desc: "A full-stack app with a separate TypeScript backend and front end.", repo: "apo-backend" },
  { name: "Interactive Game Web App", stack: "WebGL · Unity · Vercel", desc: "A responsive front end running a voice-controlled in-browser 3D game, with optimized assets.", repo: "Unity-web-game" },
  { name: "Leo Clone", stack: "TypeScript", desc: "A near-finished marketing website clone built to practice layout and motion.", repo: "leo-clone" },
  { name: "Portfolio Backend", stack: "Python · Django", desc: "An earlier Django backend powering a freelance portfolio site.", repo: "Portfolio-backend" },
];

export default function ProjectsPage() {
  return (
    <>
      <Nav />
      <main className="subpage">
        <div className="container">
          <Link href="/" className="subpage__back">
            ← Back home
          </Link>
          <span className="label">All projects</span>
          <h1 className="h-sec" style={{ marginTop: 18 }}>
            Everything I&rsquo;ve built.
          </h1>
          <p className="note" style={{ marginTop: 14, maxWidth: "56ch" }}>
            A fuller list of projects. Code is on GitHub where it&rsquo;s public.
          </p>

          <div className="subgrid">
            {PROJECTS.map((p) => (
              <article className="subcard" key={p.name}>
                <h3>{p.name}</h3>
                <p className="subcard__stack">{p.stack}</p>
                <p className="subcard__desc">{p.desc}</p>
                <a
                  href={`https://github.com/SenseiSaad/${p.repo}`}
                  target="_blank"
                  rel="noreferrer"
                  className="subcard__link"
                >
                  View on GitHub →
                </a>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
