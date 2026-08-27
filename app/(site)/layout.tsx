import { SiteChrome } from "@/components/layout/site-chrome";

/**
 * Everything a parent sees. The staff portal and the sign-in page sit outside
 * this group and get their own chrome — see components/layout/site-chrome.tsx.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteChrome>{children}</SiteChrome>;
}
