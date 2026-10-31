import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "Projects · Saad Waseem",
  description: "Full list of projects by Saad Waseem.",
};

const PROJECTS = [
  { name: "Cloud Infrastructure Automation & Deployment", stack: "Terraform · AWS · GitHub Actions", desc: "Provisioned a complete, reproducible AWS infrastructure stack using Terraform. Built automated GitHub Actions CI/CD pipelines that build container images, push them to Amazon ECR, and deploy updates to EC2 on every code push using secure IAM roles.", repo: "Saas_devops" },
  { name: "Modular REST API Backend", stack: "Django REST Framework · Docker · PostgreSQL", desc: "Designed and developed a modular DRF API managing projects, work experience, logs, and contact submissions to back the personal portfolio site. Fully containerized with Docker and Docker Compose to guarantee parity between local development and production environments.", repo: "Portfolio-backend" },
  { name: "OpenVault", stack: "Next.js · Django REST Framework · PostgreSQL · Docker · AWS", desc: "Multi-tenant enterprise document repository and AI knowledge platform built with secure role-based access control, comprehensive audit logs, and integrated RAG pipelines.", repo: "openvault" },
  { name: "Vehicle Showroom Management API", stack: "Python · Django · React · JWT", desc: "Built a comprehensive vehicle catalog backend and frontend featuring multi-parameter filtering, secure JWT authentication, and Swagger/OpenAPI documentation.", repo: "Showroom" },
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
