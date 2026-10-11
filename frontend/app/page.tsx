import SmoothScroll from "@/components/SmoothScroll";
import Loader from "@/components/Loader";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Works from "@/components/Works";
import Logs from "@/components/Logs";
import Capabilities from "@/components/Capabilities";
import Process from "@/components/Process";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const MARQUEE_ITEMS = [
  { en: "Terraform" },
  { en: "Docker" },
  { en: "AWS" },
  { en: "CI/CD" },
  { en: "Nginx" },
  { en: "PostgreSQL" },
];

export default function Page() {
  return (
    <>
      <SmoothScroll />
      <div className="grain" aria-hidden />

      <Nav />
      <main style={{ position: "relative" }}>
        <Hero />
        <Marquee items={MARQUEE_ITEMS} variant="verm" duration={30} />
        <About />
        <Experience />
        <Works />
        <Logs />
        <Capabilities />
        <Process />
        <Contact />
      </main>
      <Footer />

      <Loader />
      <Cursor />
    </>
  );
}
