"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarDays,
  Settings,
  Users,
  LogOut,
  Shield,
  FolderSearch,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

/**
 * Shared chrome for the staff and admin portals.
 *
 * A sidebar, not a top bar. This is the difference between a website and a
 * tool: the public site is read once by a parent, this is open all day at a
 * reception desk beside a ringing phone. A persistent rail means the calendar
 * is one click away from anywhere, the current section is always visible, and
 * vertical space — which the calendar grid needs — is not spent on navigation.
 *
 * It keeps the brand's colour and type but drops the illustration, texture and
 * motion. Charm is right for a parent deciding where to take their child; it
 * is friction for someone doing the same task for the two hundredth time.
 */

type NavItem = {
  href: string;
  label: string;
  icon: typeof CalendarDays;
  exact?: boolean;
};

export function PortalChrome({
  profile,
  children,
}: {
  profile: Profile;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = profile.role === "admin";

  // `exact` matters for /staff: without it every nested staff route would also
  // light up the Calendar tab.
  const primary: NavItem[] = [
    { href: "/staff", label: "Calendar", icon: CalendarDays, exact: true },
    {
      href: isAdmin ? "/admin/records" : "/staff/records",
      label: "Records",
      icon: FolderSearch,
    },
  ];

  const adminNav: NavItem[] = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/admin/configuration", label: "Configuration", icon: Settings },
    { href: "/admin/people", label: "Staff & access", icon: Users },
  ];

  const isActive = (item: NavItem) =>
    item.exact
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(`${item.href}/`);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/sign-in");
    router.refresh();
  }

  function NavLink({ item }: { item: NavItem }) {
    const active = isActive(item);
    return (
      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        onClick={() => setMobileOpen(false)}
        className={cn(
          "flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          active
            ? "bg-ink text-cream"
            : "text-ink hover:bg-ink/8"
        )}
      >
        <item.icon className="size-4 shrink-0" aria-hidden="true" />
        {item.label}
      </Link>
    );
  }

  const rail = (
    <div className="flex h-full flex-col gap-6 p-4">
      <Link
        href="/staff"
        onClick={() => setMobileOpen(false)}
        className="rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <Logo />
      </Link>

      <nav aria-label="Portal" className="flex flex-1 flex-col gap-1">
        {primary.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}

        {isAdmin && (
          <>
            <p className="mt-5 px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-ink/85">
              Administration
            </p>
            {adminNav.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </>
        )}
      </nav>

      <div className="rounded-2xl bg-cream p-3">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-ink">
          {isAdmin && (
            <Shield className="size-4 shrink-0 text-teal-text" aria-hidden="true" />
          )}
          <span className="truncate">{profile.full_name}</span>
        </p>
        <p className="mt-0.5 text-xs capitalize text-ink/85">{profile.role}</p>
        <Button
          variant="outline"
          onClick={signOut}
          className="mt-3 h-11 w-full rounded-full"
        >
          <LogOut className="size-4" aria-hidden="true" />
          Sign out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-portal">
      {/* Desktop rail */}
      <aside className="hidden w-60 shrink-0 border-r border-ink/15 bg-white lg:block">
        <div className="sticky top-0 h-screen">{rail}</div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile bar */}
        <div className="flex items-center gap-3 border-b border-ink/15 bg-white px-4 py-2.5 lg:hidden">
          <Button
            variant="outline"
            size="icon"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            className="size-11 rounded-full"
          >
            <Menu className="size-5" aria-hidden="true" />
          </Button>
          <Logo />
        </div>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 bg-ink/50"
            />
            <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-lift">
              <Button
                variant="outline"
                size="icon"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-3 size-11 rounded-full"
              >
                <X className="size-5" aria-hidden="true" />
              </Button>
              {rail}
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
