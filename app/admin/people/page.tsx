import { createClient } from "@/lib/supabase/server";
import { PeoplePanel } from "@/components/admin/people-panel";
import { PageHeader, PageBody } from "@/components/portal/page-header";

export const dynamic = "force-dynamic";

export default async function PeoplePage() {
  const supabase = await createClient();
  const [{ data: profiles }, { data: { user } }] = await Promise.all([
    supabase.from("profiles").select("*").order("full_name"),
    supabase.auth.getUser(),
  ]);

  return (
    <>
      <PageHeader
        title="Staff & access"
        description="Accounts are created here — there is no public sign-up. Everyone listed can see patient records, so deactivate anyone who leaves on the day they leave."
      />
      <PageBody>
        <PeoplePanel profiles={profiles ?? []} currentUserId={user?.id ?? null} />
      </PageBody>
    </>
  );
}
