import "server-only";
import { formatInTimeZone } from "date-fns-tz";
import type { NotificationContext, NotificationTemplate } from "@/lib/notifications";

/**
 * Email channel, via Resend.
 *
 * Deliberately plain: a booking confirmation is a utility message a parent
 * needs to read at a glance, often on a phone, sometimes while holding an
 * upset child. No marketing furniture, no tracking pixel — the latter would
 * also breach the no-behavioural-tracking rule that DPDP §9 imposes.
 *
 * A child's first name appears in these messages, which makes the email
 * provider a data processor. It needs a DPA and a line in the privacy notice.
 */

const CLINIC_TZ = "Asia/Kolkata";

function body(template: NotificationTemplate, c: NotificationContext): string {
  const when = `${formatInTimeZone(c.startsAt, CLINIC_TZ, "EEEE d MMMM")} at ${formatInTimeZone(
    c.startsAt,
    CLINIC_TZ,
    "h:mm a"
  )}`;

  const lines: Record<NotificationTemplate, string[]> = {
    booking_received: [
      `Hello ${c.parentName},`,
      ``,
      `We've received your request for ${c.childFirstName} on ${when}.`,
      `This time is held for you while we confirm it. We'll be in touch shortly.`,
      ``,
      `Reference: ${c.reference}`,
    ],
    booking_confirmed: [
      `Hello ${c.parentName},`,
      ``,
      `${c.childFirstName}'s appointment is confirmed for ${when}.`,
      c.treatment ? `Booked for: ${c.treatment}` : ``,
      ``,
      `If anything changes, call us and we'll rearrange it.`,
      ``,
      `Reference: ${c.reference}`,
    ],
    booking_rescheduled: [
      `Hello ${c.parentName},`,
      ``,
      `${c.childFirstName}'s appointment has moved to ${when}.`,
      ``,
      `Reference: ${c.reference}`,
    ],
    booking_cancelled: [
      `Hello ${c.parentName},`,
      ``,
      `${c.childFirstName}'s appointment on ${when} has been cancelled.`,
      `Call us whenever you'd like to rebook.`,
      ``,
      `Reference: ${c.reference}`,
    ],
  };

  return lines[template].filter((l) => l !== undefined).join("\n");
}

export async function sendEmail({
  to,
  subject,
  template,
  context,
}: {
  to: string;
  subject: string;
  template: NotificationTemplate;
  context: NotificationContext;
}): Promise<string> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.NOTIFICATIONS_FROM_EMAIL;

  if (!key || !from) {
    // Not configured yet. Throwing here is right: the caller logs it as a
    // failed notification, which is honest, rather than pretending it sent.
    throw new Error("Email is not configured (RESEND_API_KEY / NOTIFICATIONS_FROM_EMAIL)");
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      text: body(template, context),
    }),
  });

  if (!res.ok) {
    throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
  }

  const json = (await res.json()) as { id?: string };
  return json.id ?? "sent";
}
