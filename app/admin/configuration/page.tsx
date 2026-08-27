import { createClient } from "@/lib/supabase/server";
import { getSettings, getTreatmentTypes } from "@/lib/scheduling/queries";
import { ConfigurationForm } from "@/components/admin/configuration-form";
import { TreatmentTypesPanel } from "@/components/admin/treatment-types-panel";
import { ClosuresPanel } from "@/components/admin/closures-panel";
import { PageHeader, PageBody } from "@/components/portal/page-header";

export const dynamic = "force-dynamic";

export default async function ConfigurationPage() {
  const supabase = await createClient();
  const [settings, treatmentTypes, { data: closures }] = await Promise.all([
    getSettings(),
    getTreatmentTypes(),
    supabase.from("closures").select("*").order("starts_on"),
  ]);

  if (!settings) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center md:px-8">
        <h1 className="text-2xl font-bold text-ink">Not configured yet</h1>
        <p className="mt-3 leading-relaxed text-ink/85">
          The settings row is missing. Run{" "}
          <code className="font-mono">supabase/seed.sql</code> against the
          database.
        </p>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Configuration"
        description="Everything here takes effect immediately, including on the public booking form. Every change is recorded in the audit log."
      />
      <PageBody>
        <div className="space-y-8">
          <ConfigurationForm settings={settings} />
          <TreatmentTypesPanel treatmentTypes={treatmentTypes} />
          <ClosuresPanel closures={closures ?? []} />
        </div>
      </PageBody>
    </>
  );
}
