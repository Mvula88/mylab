import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const serif = '"Fraunces", Georgia, serif';

export default function PageShell({ children, narrow = false }) {
  return (
    <main
      className="min-h-screen w-full relative"
      style={{ backgroundColor: "#e8e4d8", color: "#1a1f2e", fontFamily: serif }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#1a1f2e 1px, transparent 1px), linear-gradient(90deg, #1a1f2e 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <SiteHeader />
      <section className="relative">
        <div className={`${narrow ? "max-w-3xl" : "max-w-6xl"} mx-auto px-5 pt-10 pb-16 sm:pt-14 sm:pb-24`}>
          {children}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
