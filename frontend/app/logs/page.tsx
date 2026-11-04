import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { LOGS } from "@/components/logs-data";
import Link from "next/link";

export const metadata = {
  title: "Logs · Saad Waseem",
  description: "Short engineering write-ups by Saad Waseem.",
};

export default function LogsPage() {
  return (
    <>
      <Nav />
      <main className="subpage">
        <div className="container">
          <Link href="/" className="subpage__back">
            ← Back home
          </Link>
          <span className="label">Logs</span>
          <h1 className="h-sec" style={{ marginTop: 18 }}>
            Notes from the terminal.
          </h1>
          <p className="note" style={{ marginTop: 14, maxWidth: "56ch" }}>
            Short write-ups on real problems and the small steps that fixed
            them. Open one to read the details.
          </p>

          <div className="loglist">
            {LOGS.map((l) => (
              <article className="loglist__item" key={l.slug}>
                <div className="loglist__meta">
                  <span className="log-card__tag">{l.tag}</span>
                  <span className="log-card__date">{l.date}</span>
                </div>
                <h3><Link href={`/logs/${l.slug}/`}>{l.title}</Link></h3>
                <p>{l.summary}</p>
                <Link href={`/logs/${l.slug}/`} className="subcard__link">
                  Read more &rarr;
                </Link>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
