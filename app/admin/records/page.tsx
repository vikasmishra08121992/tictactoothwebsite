import { Suspense } from "react";
import { searchFamilies } from "@/lib/records/queries";
import { getCurrentProfile } from "@/lib/scheduling/queries";
import { RecordsBrowser } from "@/components/records/records-browser";
import { PageHeader, PageBody } from "@/components/portal/page-header";

export const dynamic = "force-dynamic";

export default async function RecordsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const [families, profile] = await Promise.all([
    searchFamilies(q),
    getCurrentProfile(),
  ]);

  return (
    <>
      <PageHeader
        title="Patient & family records"
        description="Every family who has ever booked. Records marked unverified came from the online form, where a mobile number is a claim rather than proof — merge them into the real record once you recognise the family."
      />
      <PageBody>
        <Suspense fallback={<p className="text-ink/85">Loading records…</p>}>
          <RecordsBrowser
            families={families}
            query={q}
            canErase={profile?.role === "admin"}
          />
        </Suspense>
      </PageBody>
    </>
  );
}
