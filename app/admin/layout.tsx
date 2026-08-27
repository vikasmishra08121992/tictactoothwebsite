import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PortalChrome } from "@/components/portal/portal-chrome";
import { getCurrentProfile } from "@/lib/scheduling/queries";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/auth/sign-in");

  // A receptionist who guesses the URL gets sent to their own area rather
  // than a dead end. RLS would refuse the data regardless.
  if (profile.role !== "admin") redirect("/staff");

  return <PortalChrome profile={profile}>{children}</PortalChrome>;
}
