'use client';

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const serif = '"Fraunces", Georgia, serif';
  const mono = '"IBM Plex Mono", monospace';

  const links = [
    { href: "/labs", label: "Labs" },
    { href: "/biology", label: "Biology" },
    { href: "/chemistry", label: "Chemistry" },
    { href: "/physics", label: "Physics" },
    { href: "/maths", label: "Maths" },
    { href: "/namibia", label: "Namibia" },
    { href: "/south-africa", label: "South Africa" },
  ];

  return (
    <header
      className="relative z-30 border-b border-stone-900/10"
      style={{ backgroundColor: "#e8e4d8", color: "#1a1f2e", fontFamily: serif }}
    >
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-1">
          <span className="text-xl" style={{ fontWeight: 600 }}>
            Practikal
          </span>
          <span
            className="text-xl"
            style={{ color: "#ec407a", fontWeight: 700, lineHeight: 1 }}
          >
            .
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[11px] uppercase opacity-75 hover:opacity-100 transition"
              style={{ fontFamily: mono, letterSpacing: "0.18em" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/labs"
            className="text-[11px] uppercase py-2 px-3 active:scale-95"
            style={{
              fontFamily: mono,
              letterSpacing: "0.22em",
              backgroundColor: "#1a1f2e",
              color: "#e8e4d8",
              fontWeight: 500,
            }}
          >
            Start a Lab
          </Link>
        </nav>
        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-stone-900/10">
          <div className="max-w-6xl mx-auto px-5 py-3 flex flex-col gap-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[12px] uppercase py-2 opacity-80"
                onClick={() => setOpen(false)}
                style={{ fontFamily: mono, letterSpacing: "0.18em" }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/labs"
              className="text-[12px] uppercase py-2 px-3 mt-1 text-center"
              onClick={() => setOpen(false)}
              style={{
                fontFamily: mono,
                letterSpacing: "0.22em",
                backgroundColor: "#1a1f2e",
                color: "#e8e4d8",
              }}
            >
              Start a Lab
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
