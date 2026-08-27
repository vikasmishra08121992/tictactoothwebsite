import "server-only";
import { createServiceClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/notifications/email";
import { sendWhatsApp } from "@/lib/notifications/whatsapp";

/**
 * Notification dispatch.
 *
 * Two rules hold this together:
 *
 *  1. **A notification failure never fails the booking.** Every caller wraps
 *     this in a catch. A parent must not lose an appointment because a mail
 *     provider had a bad minute, and reception must not see an error for
 *     something that already succeeded.
 *
 *  2. **Every attempt is logged**, success or failure, so "did they get told?"
 *     is answerable at the desk instead of guessed at.
 *
 * WhatsApp stays behind a flag until the Meta Business verification, BSP
 * account and template approval exist — see DECISIONS.md. Until then this
 * degrades to email only, silently and by design.
 */

export type NotificationTemplate =
  | "booking_received"
  | "booking_confirmed"
  | "booking_rescheduled"
  | "booking_cancelled";

const SUBJECTS: Record<NotificationTemplate, string> = {
  booking_received: "We've received your appointment request",
  booking_confirmed: "Your appointment is confirmed",
  booking_rescheduled: "Your appointment time has changed",
  booking_cancelled: "Your appointment has been cancelled",
};

/**
 * Notify by booking reference.
 *
 * The public booking RPC returns a reference, not a row id — it has no reason
 * to hand internal identifiers to an anonymous caller. This resolves it.
 */
export async function notifyAppointmentByReference(
  reference: string,
  template: NotificationTemplate
): Promise<void> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("appointments")
    .select("id")
    .eq("reference", reference)
    .single();

  if (data?.id) await notifyAppointment(data.id, template);
}

export async function notifyAppointment(
  appointmentId: string,
  template: NotificationTemplate
): Promise<void> {
  // Runs with the service role: notifications fire from contexts that have no
  // user session at all (scheduled jobs, the anonymous booking path).
  const supabase = createServiceClient();

  const { data: appointment } = await supabase
    .from("appointments")
    .select(
      `*,
       patients ( first_name, families ( contact_name, mobile, email ) ),
       treatment_types ( name )`
    )
    .eq("id", appointmentId)
    .single();

  if (!appointment) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const a = appointment as any;
  const family = a.patients?.families;
  if (!family) return;

  const context = {
    reference: a.reference as string,
    childFirstName: a.patients?.first_name as string,
    parentName: family.contact_name as string,
    startsAt: a.starts_at as string,
    treatment: a.treatment_types?.name as string | undefined,
  };

  async function record(
    channel: string,
    status: string,
    providerId?: string,
    error?: string
  ) {
    await supabase.from("notification_log").insert({
      appointment_id: appointmentId,
      channel,
      template,
      status,
      provider_id: providerId ?? null,
      error: error ?? null,
    });
  }

  if (family.email) {
    try {
      const id = await sendEmail({
        to: family.email,
        subject: SUBJECTS[template],
        template,
        context,
      });
      await record("email", "sent", id);
    } catch (err) {
      await record("email", "failed", undefined, String(err));
    }
  }

  if (process.env.WHATSAPP_ENABLED === "true" && family.mobile) {
    try {
      const id = await sendWhatsApp({
        to: family.mobile,
        template,
        context,
      });
      await record("whatsapp", "sent", id);
    } catch (err) {
      await record("whatsapp", "failed", undefined, String(err));
    }
  } else if (family.mobile) {
    await record("whatsapp", "skipped", undefined, "WHATSAPP_ENABLED is false");
  }
}

export type NotificationContext = {
  reference: string;
  childFirstName: string;
  parentName: string;
  startsAt: string;
  treatment?: string;
};
