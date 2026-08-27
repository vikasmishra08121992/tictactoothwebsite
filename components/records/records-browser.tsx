"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Search, Merge, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { mergeFamilies, eraseFamily } from "@/lib/records/actions";
import type { FamilyRecord } from "@/lib/records/queries";
import { cn } from "@/lib/utils";

/** Age is derived, never stored — a record saying "7" is wrong within a year. */
function ageFrom(dob: string | null): string {
  if (!dob) return "age not given";
  const b = new Date(dob);
  const now = new Date();
  let years = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) years--;
  if (years < 2) {
    const months = years * 12 + m + (now.getDate() < b.getDate() ? -1 : 0);
    return `${Math.max(0, months)} months`;
  }
  return `${years} years`;
}

const fmt = (iso: string) => {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

export function RecordsBrowser({
  families,
  query,
  canErase,
}: {
  families: FamilyRecord[];
  query: string;
  canErase: boolean;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [term, setTerm] = useState(query);
  const [pending, startTransition] = useTransition();

  /** The record chosen as the one to keep when merging. */
  const [mergeTarget, setMergeTarget] = useState<FamilyRecord | null>(null);
  const [erasing, setErasing] = useState<FamilyRecord | null>(null);

  const runSearch = (value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value.trim()) next.set("q", value.trim());
    else next.delete("q");
    router.push(`?${next.toString()}`);
  };

  return (
    <div className="space-y-6">
      <form
        role="search"
        className="flex flex-wrap items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          runSearch(term);
        }}
      >
        <div className="min-w-64 flex-1">
          <Label htmlFor="records-search">
            Search by parent name, mobile or child&apos;s first name
          </Label>
          <Input
            id="records-search"
            type="search"
            className="mt-1.5"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="e.g. 98765 43210"
          />
        </div>
        <Button type="submit" className="h-12 rounded-full px-6">
          <Search className="size-4" aria-hidden="true" />
          Search
        </Button>
      </form>

      {mergeTarget && (
        <div
          role="status"
          className="flex flex-wrap items-center gap-3 rounded-2xl border-2 border-gold bg-gold/25 p-4"
        >
          <Merge className="size-5 shrink-0 text-ink" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-ink">
            Keeping <strong>{mergeTarget.contact_name}</strong> ·{" "}
            {mergeTarget.mobile}. Now choose the duplicate to merge into it —
            its children move across and its visit history comes with them.
          </p>
          <Button
            variant="outline"
            className="ml-auto h-11 rounded-full px-5"
            onClick={() => setMergeTarget(null)}
          >
            Cancel merge
          </Button>
        </div>
      )}

      <p aria-live="polite" className="text-sm text-ink/85">
        {families.length === 0
          ? query
            ? `No records match “${query}”.`
            : "No records yet."
          : `${families.length} record${families.length === 1 ? "" : "s"}${
              query ? ` matching “${query}”` : " — most recent first"
            }.`}
      </p>

      <ul className="space-y-4">
        {families.map((f) => {
          const merged = f.merged_into_id !== null;
          const isTarget = mergeTarget?.id === f.id;

          return (
            <li
              key={f.id}
              className={cn(
                "rounded-3xl p-5 shadow-soft md:p-6",
                // A merged record is de-emphasised with a recessed ground and
                // a badge, never with `opacity`. Opacity multiplies through
                // every descendant — text-ink/85 inside an opacity-70 card
                // renders at ~55% and fails contrast, which is how a whole
                // card of children's details became unreadable.
                merged ? "bg-portal" : "bg-white",
                isTarget && "ring-2 ring-gold"
              )}
            >
              <div className="flex flex-wrap items-start gap-x-3 gap-y-2">
                <h2 className="font-display text-lg font-bold text-ink">
                  {f.contact_name}
                </h2>
                <span className="text-sm text-ink/85">{f.relationship}</span>

                {f.is_provisional && !merged && (
                  <span className="rounded-full bg-blush/40 px-3 py-1 text-xs font-bold text-ink">
                    Unverified — booked online
                  </span>
                )}
                {merged && (
                  <span className="rounded-full bg-ink px-3 py-1 text-xs font-bold text-cream">
                    Merged into another record
                  </span>
                )}
              </div>

              <p className="mt-1 text-sm text-ink/85">
                <a
                  href={`tel:${f.mobile}`}
                  className="font-semibold text-ink underline underline-offset-2"
                >
                  {f.mobile}
                </a>
                {f.email && <> · {f.email}</>} · added {fmt(f.created_at)}
              </p>

              <ul className="mt-3 flex flex-wrap gap-2">
                {f.patients.length === 0 ? (
                  <li className="text-sm text-ink/85">No children on this record.</li>
                ) : (
                  f.patients.map((p) => (
                    <li
                      key={p.id}
                      className="rounded-2xl bg-cream px-3 py-2 text-sm text-ink"
                    >
                      <strong>{p.first_name}</strong>{" "}
                      <span className="text-ink/85">· {ageFrom(p.date_of_birth)}</span>
                      {p.accessibility_notes && (
                        <span className="mt-1 block text-xs text-ink/85">
                          {p.accessibility_notes}
                        </span>
                      )}
                    </li>
                  ))
                )}
              </ul>

              {f.notes && (
                <p className="mt-3 rounded-2xl bg-cream p-3 text-sm text-ink/85">
                  {f.notes}
                </p>
              )}

              {!merged && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {!mergeTarget ? (
                    <Button
                      variant="outline"
                      className="h-11 rounded-full px-4"
                      onClick={() => setMergeTarget(f)}
                    >
                      <Merge className="size-4" aria-hidden="true" />
                      Merge duplicates into this
                    </Button>
                  ) : isTarget ? (
                    <span className="text-sm font-semibold text-ink">
                      This is the record being kept.
                    </span>
                  ) : (
                    <Button
                      disabled={pending}
                      className="h-11 rounded-full px-4"
                      onClick={() =>
                        startTransition(async () => {
                          const res = await mergeFamilies(f.id, mergeTarget.id);
                          if (res.ok) {
                            toast.success("Records merged");
                            setMergeTarget(null);
                            router.refresh();
                          } else toast.error(res.error);
                        })
                      }
                    >
                      Merge this into {mergeTarget.contact_name}
                    </Button>
                  )}

                  {canErase && !mergeTarget && (
                    <Button
                      variant="outline"
                      className="h-11 rounded-full border-crimson-btn px-4 text-crimson-text"
                      onClick={() => setErasing(f)}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                      Erase on request
                    </Button>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {erasing && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="erase-title"
          className="fixed inset-0 z-100 flex items-center justify-center bg-ink/60 p-4"
        >
          <form
            className="w-full max-w-lg rounded-3xl bg-white p-6"
            onSubmit={(e) => {
              e.preventDefault();
              const reason = String(
                new FormData(e.currentTarget).get("reason") ?? ""
              );
              const family = erasing;
              startTransition(async () => {
                const res = await eraseFamily(family.id, reason);
                if (res.ok) {
                  toast.success("Records erased");
                  setErasing(null);
                  router.refresh();
                } else toast.error(res.error);
              });
            }}
          >
            <h2
              id="erase-title"
              className="flex items-center gap-2 font-display text-xl font-bold text-ink"
            >
              <AlertTriangle className="size-5 text-crimson-text" aria-hidden="true" />
              Erase {erasing.contact_name}&apos;s records
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-ink/85">
              This permanently deletes this family, the{" "}
              {erasing.patients.length === 1
                ? "child"
                : `${erasing.patients.length} children`}{" "}
              on the record, and every appointment in their history. It cannot
              be undone and there is no backup copy in the application.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink/85">
              The deletion itself is logged — date, who did it, and the reason
              below — because that record is what makes the erasure
              demonstrable if anyone asks later.
            </p>
            <p
              id="erase-reason-help"
              className="mt-2 text-sm leading-relaxed text-ink/85"
            >
              <strong className="text-ink">Do not put names in the reason.</strong>{" "}
              The log outlives the record, so a name typed here would survive
              the erasure it is describing. &ldquo;Parent requested deletion by
              phone&rdquo; is enough.
            </p>

            <div className="mt-4">
              <Label htmlFor="erase-reason">Reason</Label>
              <Textarea
                id="erase-reason"
                name="reason"
                required
                rows={3}
                className="mt-1.5"
                placeholder="Parent requested deletion by phone on DD/MM/YYYY"
                aria-describedby="erase-reason-help"
              />
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-full px-6"
                onClick={() => setErasing(null)}
              >
                Keep the records
              </Button>
              <Button
                type="submit"
                disabled={pending}
                className="h-12 rounded-full bg-crimson-btn px-6 text-white hover:bg-crimson-btn/90"
              >
                {pending ? "Erasing…" : "Erase permanently"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
