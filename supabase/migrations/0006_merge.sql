-- Family merge.
--
-- This is the other half of the decision that online bookings never attach to
-- an existing family. That rule is what stops an anonymous visitor inheriting
-- someone else's children by typing their mobile number — but it guarantees
-- duplicates whenever a returning parent books online. Merging is how those
-- duplicates get reconciled, and it is a *staff* action performed while
-- looking at both records, not an inference drawn from a form field.
--
-- The source family is not deleted. `merged_into_id` leaves a trail, so a
-- mistaken merge can be understood afterwards; erase_family remains the only
-- thing that actually removes a family, and it is admin-only.

create or replace function merge_families(
  p_source_id uuid,
  p_target_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_moved int;
begin
  if not is_staff() then
    raise exception 'Only staff may merge records' using errcode = '42501';
  end if;

  if p_source_id = p_target_id then
    raise exception 'A family cannot be merged into itself';
  end if;

  -- Merging into an already-merged record would build a chain that reception
  -- has no way to see. Make them pick the surviving record.
  if exists (select 1 from families
              where id = p_target_id and merged_into_id is not null) then
    raise exception 'That record has itself been merged. Choose the current record instead.';
  end if;

  if exists (select 1 from families
              where id = p_source_id and merged_into_id is not null) then
    raise exception 'That record has already been merged.';
  end if;

  if not exists (select 1 from families where id = p_target_id) then
    raise exception 'The record being merged into no longer exists.';
  end if;

  -- Children move to the surviving family. Appointments follow their patient,
  -- so visit history travels with them and nothing needs rewriting.
  update patients set family_id = p_target_id, updated_at = now()
   where family_id = p_source_id;
  get diagnostics v_moved = row_count;

  -- Consents record who granted permission and stay attached to the family
  -- that granted them: re-pointing them would misrepresent the evidence.

  update families
     set merged_into_id = p_target_id,
         updated_at     = now()
   where id = p_source_id;

  -- The surviving record is now the confirmed one — a merge is a member of
  -- staff vouching for the identity that an online form could not.
  update families
     set is_provisional = false,
         updated_at     = now()
   where id = p_target_id;

  insert into audit_log (actor_id, action, entity, entity_id, diff)
    values (auth.uid(), 'MERGE', 'families', p_source_id,
            jsonb_build_object('into', p_target_id, 'patients_moved', v_moved));
end;
$$;

revoke all on function merge_families(uuid, uuid) from public;
grant execute on function merge_families(uuid, uuid) to authenticated;
