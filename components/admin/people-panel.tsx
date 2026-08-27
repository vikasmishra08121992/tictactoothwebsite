"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { UserPlus, Shield, ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AppRole, Profile } from "@/lib/supabase/types";
import { inviteStaff, setStaffActive, setStaffRole } from "@/lib/admin/actions";

/** Generates a temporary password rather than letting an admin invent one. */
function makePassword() {
  const bytes = new Uint8Array(18);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes)).replace(/[+/=]/g, "").slice(0, 20);
}

export function PeoplePanel({
  profiles,
  currentUserId,
}: {
  profiles: Profile[];
  currentUserId: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const [adding, setAdding] = useState(false);
  const [role, setRole] = useState<AppRole>("receptionist");
  const [issued, setIssued] = useState<{ email: string; password: string } | null>(null);

  return (
    <div className="space-y-6">
      <Button
        variant="outline"
        onClick={() => setAdding((a) => !a)}
        className="h-11 rounded-full px-5"
      >
        <UserPlus className="size-4" aria-hidden="true" />
        Add a staff account
      </Button>

      {adding && (
        <form
          className="rounded-3xl bg-white p-6 shadow-soft"
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            const email = String(f.get("email") ?? "").trim();
            const fullName = String(f.get("fullName") ?? "").trim();
            const password = makePassword();

            startTransition(async () => {
              const res = await inviteStaff({
                email,
                fullName,
                role,
                temporaryPassword: password,
              });
              if (res.ok) {
                // Shown once. Supabase never reveals it again, and there is no
                // self-service reset — the admin has to hand it over directly.
                setIssued({ email, password });
                setAdding(false);
                toast.success("Account created");
              } else {
                toast.error(res.error);
              }
            });
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" name="fullName" required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="email">Work email</Label>
              <Input id="email" name="email" type="email" required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select
                value={role}
                onValueChange={(v) => setRole(v as AppRole)}
                items={{
                  receptionist: "Receptionist — calendar and patients",
                  admin: "Administrator — everything, including this page",
                }}
              >
                <SelectTrigger id="role" className="mt-1.5 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receptionist">
                    Receptionist — calendar and patients
                  </SelectItem>
                  <SelectItem value="admin">
                    Administrator — everything, including this page
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" disabled={pending} className="mt-5 h-12 rounded-full px-6">
            {pending ? "Creating…" : "Create account"}
          </Button>
        </form>
      )}

      {issued && (
        <div className="rounded-3xl border-2 border-gold bg-gold/25 p-6">
          <h2 className="font-display text-lg font-bold text-ink">
            Temporary password for {issued.email}
          </h2>
          <p className="mt-2 font-mono text-lg font-bold text-ink">{issued.password}</p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/85">
            This is shown once and cannot be retrieved. Give it to them
            directly, in person or over the phone — not over email or WhatsApp,
            because it opens a system holding patient records. Ask them to
            change it once they are in.
          </p>
          <Button
            variant="outline"
            className="mt-4 h-11 rounded-full px-5"
            onClick={() => setIssued(null)}
          >
            I have passed it on
          </Button>
        </div>
      )}

      <ul className="space-y-3">
        {profiles.map((p) => {
          const isSelf = p.id === currentUserId;
          return (
            <li
              key={p.id}
              className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 shadow-soft"
            >
              <span className="font-semibold text-ink">
                {p.full_name}
                {isSelf && <span className="font-normal text-ink/85"> (you)</span>}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                  p.role === "admin" ? "bg-ink text-cream" : "bg-mint text-ink"
                }`}
              >
                {p.role}
              </span>

              {!p.is_active && (
                <span className="rounded-full bg-crimson/20 px-3 py-1 text-xs font-bold text-crimson-text">
                  Deactivated
                </span>
              )}

              <div className="ml-auto flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  disabled={pending}
                  className="h-11 rounded-full px-4"
                  onClick={() =>
                    startTransition(async () => {
                      const res = await setStaffRole(
                        p.id,
                        p.role === "admin" ? "receptionist" : "admin"
                      );
                      if (res.ok) toast.success("Role updated");
                      else toast.error(res.error);
                    })
                  }
                >
                  {p.role === "admin" ? (
                    <ShieldOff className="size-4" aria-hidden="true" />
                  ) : (
                    <Shield className="size-4" aria-hidden="true" />
                  )}
                  {p.role === "admin" ? "Make receptionist" : "Make admin"}
                </Button>

                <Button
                  variant="outline"
                  disabled={pending || (isSelf && p.is_active)}
                  className="h-11 rounded-full px-4"
                  onClick={() =>
                    startTransition(async () => {
                      const res = await setStaffActive(p.id, !p.is_active);
                      if (res.ok) toast.success("Updated");
                      else toast.error(res.error);
                    })
                  }
                >
                  {p.is_active ? "Deactivate" : "Reactivate"}
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
