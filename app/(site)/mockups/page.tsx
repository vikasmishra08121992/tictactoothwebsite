import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Mockups Index",
  description: "Every screen in the Tic Tac Tooth design mockup, in one place.",
};

const groups: {
  title: string;
  screens: { label: string; href: string; note?: string }[];
}[] = [
  {
    title: "Core",
    screens: [
      { label: "Home", href: "/" },
      { label: "Our Space", href: "/our-space", note: "Room photo tour" },
      { label: "Treatments", href: "/treatments", note: "All 18, one list" },
      { label: "No Cavity Club", href: "/no-cavity-club" },
    ],
  },
  {
    title: "Treatment detail",
    screens: [
      { label: "Cavity fillings", href: "/treatments/cavity-fillings", note: "Bespoke detail" },
      { label: "Braces & clear aligners", href: "/treatments/braces-clear-aligners", note: "Teen-tagged" },
      { label: "Dental trauma", href: "/treatments/dental-trauma", note: "Bespoke detail" },
      { label: "General anaesthesia", href: "/treatments/general-anaesthesia" },
      { label: "Sealants", href: "/treatments/sealants", note: "Templated example" },
    ],
  },
  {
    title: "Care & information",
    screens: [
      { label: "Special Needs & Inclusive Care", href: "/special-needs", note: "Includes social story" },
      { label: "Dental Emergency", href: "/emergency", note: "Call-first" },
      { label: "Comfort & Sedation", href: "/comfort-and-sedation" },
      { label: "Growing Up Smiling", href: "/growing-up-smiling", note: "Height-chart rail" },
      { label: "Meet the Doctor", href: "/meet-the-doctor" },
      { label: "For Parents", href: "/for-parents" },
      { label: "Reviews", href: "/reviews" },
    ],
  },
  {
    title: "Booking & contact",
    screens: [
      { label: "Book an Appointment", href: "/book", note: "6-step wizard" },
      { label: "Contact & Location", href: "/contact" },
    ],
  },
  {
    title: "Utility",
    screens: [{ label: "404 — playable tic-tac-toe", href: "/this-page-does-not-exist" }],
  },
];

export default function MockupsIndexPage() {
  return (
    <div className="min-h-screen bg-ink px-4 py-12 text-cream md:px-8 md:py-16">
      <div className="mx-auto max-w-6xl">
        <p className="font-display text-lg font-bold tracking-tight text-cream">
          Tic Tac Tooth
        </p>
        <h1 className="mt-6 text-3xl font-bold md:text-4xl">Mockups index</h1>
        <p className="mt-2 max-w-2xl text-cream/75">
          Every screen in this deliverable, grouped by how it fits the site
          architecture.
        </p>

        <div className="mt-10 space-y-10">
          {groups.map((group) => (
            <div key={group.title}>
              <h2 className="text-sm font-bold uppercase tracking-wide text-lavender">
                {group.title}
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.screens.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="group flex items-start justify-between gap-2 rounded-xl border border-cream/15 bg-cream/5 p-4 transition-colors hover:bg-cream/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
                  >
                    <span>
                      <span className="block font-semibold text-cream">{s.label}</span>
                      {s.note && (
                        <span className="mt-0.5 block text-xs text-cream/75">{s.note}</span>
                      )}
                    </span>
                    <ArrowUpRight
                      className="mt-0.5 size-4 shrink-0 text-cream/75 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
