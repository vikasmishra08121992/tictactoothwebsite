import { Suspense } from "react";
import { searchFamilies } from "@/lib/records/queries";
import { RecordsBrowser } from "@/components/records/records-browser";
import { PageHeader, PageBody } from "@/components/portal/page-header";

export const dynamic = "force-dynamic";

/**
 * Reception's view of the same records.
 *
 * Identical to the admin view except that `canErase` is false. Reception needs
 * merge — duplicates are created by the very online bookings they process —
 * but permanent deletion of a child's record stays with an administrator.
 */
export default async function StaffRecordsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const families = await searchFamilies(q);

  return (
    <>
      <PageHeader
        title="Patient & family records"
        description="Search for a family before you call them back, and merge the duplicate records that online bookings create."
      />
      <PageBody>
        <Suspense fallback={<p className="text-ink/85">Loading records…</p>}>
          <RecordsBrowser families={families} query={q} canErase={false} />
        </Suspense>
      </PageBody>
    </>
  );
}
