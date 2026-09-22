import type { Metadata } from "next";
import { Baloo_2, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

/*
  Body copy is Plus Jakarta Sans, replacing Inter.

  Inter is a fine interface font and a slightly cold one for paragraphs about
  a child's first visit to the dentist. Plus Jakarta Sans is more open — a
  larger x-height and rounder forms — which reads more warmly next to Baloo's
  rounded display face and holds up better at the larger body size set in
  globals.css. The client asked for the section write-ups to be more readable;
  that is a font choice and a size choice together, and this is the font half.
*/
const body = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Tic Tac Tooth — Kids Dental Hospital, Maninagar, Ahmedabad",
    template: "%s · Tic Tac Tooth",
  },
  description:
    "Tic Tac Tooth is a paediatric dental hospital in Maninagar, Ahmedabad, treating children and teenagers from birth to 18 — two themed treatment rooms, laughing gas sedation on site, and full sensory-friendly and special-needs pathways.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${baloo.variable} ${body.variable}`}>
      {/*
        No `h-full` on <html>: pinning it to the viewport height moves the
        scroll container off the document, which silently breaks
        window.scrollTo and anything driven by scroll position.

        This layout deliberately renders no header, footer or <main>. Those
        belong to the public site only — see app/(site)/layout.tsx. The staff
        portal and the sign-in page provide their own, and previously
        inherited the marketing chrome from here whether they wanted it or not.
      */}
      <body className="flex min-h-screen flex-col bg-cream font-sans text-ink antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
