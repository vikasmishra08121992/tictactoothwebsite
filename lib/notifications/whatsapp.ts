import "server-only";
import { formatInTimeZone } from "date-fns-tz";
import type { NotificationContext, NotificationTemplate } from "@/lib/notifications";

/**
 * WhatsApp channel.
 *
 * Written against the WhatsApp Business Cloud API shape, which the common
 * Indian BSPs (Gupshup, Twilio, 360dialog) all proxy. Swapping provider should
 * mean changing the URL and auth header, not this file's structure.
 *
 * **This cannot be switched on yet, and that is not a code problem.** It needs
 * a Meta Business account, business verification, a BSP contract, and
 * per-template approval — days to weeks of client-side process, with a
 * per-message cost. Until `WHATSAPP_ENABLED=true` and the template names are
 * set, dispatch skips this channel and logs that it did.
 *
 * Note the shape of the constraint: WhatsApp does not let you send arbitrary
 * text to someone who has not messaged you recently. Everything outbound must
 * be a pre-approved template with positional variables — which is why the
 * message text lives in Meta's console, not here, and why this function only
 * supplies the variables.
 */

const CLINIC_TZ = "Asia/Kolkata";

const TEMPLATE_ENV: Record<NotificationTemplate, string | undefined> = {
  booking_received: process.env.WHATSAPP_TEMPLATE_BOOKING_RECEIVED,
  booking_confirmed: process.env.WHATSAPP_TEMPLATE_BOOKING_CONFIRMED,
  // Not yet submitted for approval — dispatch logs these as skipped.
  booking_rescheduled: undefined,
  booking_cancelled: undefined,
};

/** E.164 for India. Reception may store numbers with or without a country code. */
function toE164(mobile: string): string {
  const digits = mobile.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return digits;
  return digits;
}

export async function sendWhatsApp({
  to,
  template,
  context,
}: {
  to: string;
  template: NotificationTemplate;
  context: NotificationContext;
}): Promise<string> {
  const url = process.env.WHATSAPP_API_URL;
  const token = process.env.WHATSAPP_API_TOKEN;
  const templateName = TEMPLATE_ENV[template];

  if (!url || !token) {
    throw new Error("WhatsApp is not configured (WHATSAPP_API_URL / WHATSAPP_API_TOKEN)");
  }
  if (!templateName) {
    throw new Error(`No approved WhatsApp template for "${template}"`);
  }

  const when = `${formatInTimeZone(context.startsAt, CLINIC_TZ, "EEEE d MMMM")} at ${formatInTimeZone(
    context.startsAt,
    CLINIC_TZ,
    "h:mm a"
  )}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: toE164(to),
      type: "template",
      template: {
        name: templateName,
        language: { code: "en" },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: context.parentName },
              { type: "text", text: context.childFirstName },
              { type: "text", text: when },
              { type: "text", text: context.reference },
            ],
          },
        ],
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`WhatsApp provider responded ${res.status}: ${await res.text()}`);
  }

  const json = (await res.json()) as { messages?: { id?: string }[] };
  return json.messages?.[0]?.id ?? "sent";
}
