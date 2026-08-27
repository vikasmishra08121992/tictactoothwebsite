"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, MessageCircle, Siren } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Logo } from "@/components/layout/logo";
import { clinic, primaryNav } from "@/lib/content/site";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/85">
      {/* utility bar — contact routes, always reachable */}
      <div className="hidden items-center justify-end gap-4 bg-ink px-6 text-xs text-cream md:flex">
        <a
          href={clinic.phoneHref}
          className="inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap font-medium hover:underline"
        >
          <Phone className="size-3.5" aria-hidden="true" />
          {clinic.phoneDisplay}
        </a>
        <a
          href={clinic.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap font-medium hover:underline"
        >
          <MessageCircle className="size-3.5" aria-hidden="true" />
          WhatsApp us
        </a>
        <span className="inline-flex min-h-11 items-center whitespace-nowrap text-cream/75">
          {clinic.landmark}
        </span>
      </div>

      {/* masthead */}
      <div className="mx-auto flex w-full max-w-[110rem] items-center gap-4 px-4 py-3 md:px-8">
        <Logo />

        <div className="ml-auto flex items-center gap-2.5">
          {/*
            Emergency is the loudest control on the page by design: a parent
            reaching this site at 9pm with a knocked-out tooth should not have
            to look for it. Solid crimson, a siren icon, and a gold ring that
            separates it from the booking button beside it.
          */}
          <ButtonLink
            href="/emergency"
            className="h-12 gap-2 whitespace-nowrap rounded-full bg-crimson-btn px-5 text-base font-bold text-white shadow-pop ring-4 ring-gold hover:bg-crimson-btn/90"
          >
            <Siren className="size-5" aria-hidden="true" />
            Emergency
          </ButtonLink>

          <ButtonLink
            href="/book"
            variant="outline"
            className="hidden h-12 whitespace-nowrap rounded-full border-2 border-ink bg-transparent px-5 text-base font-bold text-ink hover:bg-ink hover:text-cream sm:inline-flex"
          >
            Book appointment
          </ButtonLink>

          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="size-12 rounded-full border-2 border-ink lg:hidden"
                  aria-label="Open menu"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex w-[320px] flex-col gap-1 overflow-y-auto bg-cream"
            >
              <SheetHeader>
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 px-4 pb-6">
                <SheetClose
                  render={
                    <Link
                      href="/emergency"
                      className="mb-3 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-crimson-btn px-3 text-sm font-bold text-white ring-4 ring-gold"
                    />
                  }
                >
                  <Siren className="size-5" aria-hidden="true" />
                  Dental Emergency
                </SheetClose>
                {primaryNav.map((item) => (
                  <SheetClose
                    key={item.href}
                    render={
                      <Link
                        href={item.href}
                        className="flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold text-ink hover:bg-ink/5"
                      />
                    }
                  >
                    {item.label}
                  </SheetClose>
                ))}
                <SheetClose
                  render={
                    <Link
                      href="/book"
                      className="mt-3 flex min-h-12 items-center justify-center rounded-xl bg-primary px-3 text-sm font-bold text-primary-foreground"
                    />
                  }
                >
                  Book appointment
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/*
        Full navigation on its own row. Every destination is visible at all
        times — no dropdown — which only fits once the nav has a line to
        itself rather than competing with the logo and CTAs.
      */}
      <nav
        aria-label="Primary"
        className="hidden border-y border-ink/10 bg-white/70 lg:block"
      >
        <ul className="mx-auto flex w-full max-w-[110rem] flex-wrap items-center justify-center gap-x-1 px-4 md:px-8">
          {primaryNav.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-3 text-[0.9rem] font-semibold transition-colors hover:bg-ink/8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                    active ? "bg-ink text-cream hover:bg-ink" : "text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
