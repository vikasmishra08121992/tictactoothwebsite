import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { StickyActionBar } from "@/components/layout/sticky-action-bar";

/**
 * The public site's frame: skip link, header, main landmark, footer, and the
 * sticky action bar.
 *
 * This lives one level below the root layout on purpose. When it was in the
 * root layout it wrapped *everything*, including the staff sign-in page —
 * which then rendered a second `<main>` inside this one (three axe violations)
 * and, worse, showed a receptionist the marketing navigation and an
 * "Emergency" bar while they were trying to log in.
 *
 * It is a component rather than only a layout because `app/not-found.tsx`
 * handles unmatched URLs globally and so sits outside the `(site)` route
 * group. Both places need the same frame and must not drift apart.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="skip-link rounded-md bg-ink px-4 py-2 text-sm font-semibold text-cream"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <StickyActionBar />
    </>
  );
}
