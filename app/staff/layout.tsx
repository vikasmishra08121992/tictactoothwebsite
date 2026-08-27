import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PortalChrome } from "@/components/portal/portal-chrome";
import { getCurrentProfile } from "@/lib/scheduling/queries";

export const metadata: Metadata = {
  title: "Staff",
  robots: { index: false, follow: false },
};

/**
 * Staff area.
 *
 * Middleware has already checked that *someone* is signed in; this layout
 * checks that they are an active member of staff. Both matter — a deactivated
 * account keeps a valid session until it expires, and should lose access the
 * moment it is switched off rather than whenever the token happens to lapse.
 */
export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/auth/sign-in");

  return <PortalChrome profile={profile}>{children}</PortalChrome>;
}
