import type { Metadata } from "next";
import { Suspense } from "react";
import { SignInForm } from "@/components/auth/sign-in-form";
import { Logo } from "@/components/layout/logo";

export const metadata: Metadata = {
  title: "Staff sign-in",
  robots: { index: false, follow: false },
};

/**
 * Staff sign-in. There is deliberately no sign-up route and no password-reset
 * self-service — accounts are created by an administrator. A public sign-up on
 * a system holding children's records would be an obvious way in.
 */
export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-4 py-16">
      <div className="w-full max-w-md">
        <div className="flex justify-center">
          <Logo invert />
        </div>

        <div className="mt-10 rounded-3xl bg-cream p-8 shadow-lift">
          <h1 className="text-2xl font-bold text-ink">Staff sign-in</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink/85">
            For clinic staff only. If you need an account, ask an
            administrator to create one for you.
          </p>

          {/* The form reads ?next= to return staff to the page they were
              heading for, which opts it out of prerendering. */}
          <Suspense
            fallback={<div className="mt-6 h-64" aria-hidden="true" />}
          >
            <SignInForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-cream/85">
          This system holds patient records. Do not share your sign-in, and
          lock your screen when you step away from the desk.
        </p>
      </div>
    </main>
  );
}
