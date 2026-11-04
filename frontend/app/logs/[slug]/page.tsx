import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LOGS } from "@/components/logs-data";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return LOGS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const log = LOGS.find((l) => l.slug === slug);
  return {
    title: log ? `${log.title} · Saad Waseem` : "Logs · Saad Waseem",
    description: log?.summary ?? "Short engineering write-ups by Saad Waseem.",
  };
}

export default async function LogPost({ params }: Params) {
  const { slug } = await params;
  const log = LOGS.find((l) => l.slug === slug);
  if (!log) notFound();

  return (
    <>
      <Nav />
      <main className="subpage">
        <div className="container">
          <Link href="/logs/" className="subpage__back">
            &larr; All logs
          </Link>

          <span className="label" style={{ marginTop: 30 }}>Logs · {log.tag}</span>
          <h1 className="logpost__title">{log.title}</h1>
          <p className="logpost__meta">{log.date} · {log.tag}</p>

          <p className="logpost__lead">{log.summary}</p>

          <div className="logpost">
            {log.sections.map((section) => (
              <section className="logpost__section" key={section.heading}>
                <h2>{section.heading}</h2>
                <p>{section.body}</p>
              </section>
            ))}
          </div>

          <Link href="/logs/" className="logpost__back">
            &larr; Back to all logs
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
