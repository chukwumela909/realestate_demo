import { Resend } from "resend";
import { CLOUD9_CONTACT } from "./cloud9Knowledge";

declare global {
  var resend: Resend | undefined;
}

type EmailClient = {
  emails: {
    send: (payload: {
      from: string;
      to: string;
      subject: string;
      html: string;
      text: string;
      replyTo: string;
    }) => Promise<{
      data?: { id?: string } | null;
      error?: { message?: string } | null;
    }>;
  };
};

function getResend(): EmailClient | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!global.resend) global.resend = new Resend(key);
  return global.resend;
}

const RESEND_TEST_FROM = "Cloud9 Properties Limited <onboarding@resend.dev>";

function getConfiguredFrom(allowTestSender = false) {
  const from = process.env.CLOUD9_FROM_EMAIL ?? process.env.MAISON_FROM_EMAIL;
  if (from) return { ok: true as const, from };
  if (allowTestSender) return { ok: true as const, from: RESEND_TEST_FROM };
  return {
    ok: false as const,
    error:
      "Missing CLOUD9_FROM_EMAIL. Configure a verified Resend sender before sending to customers.",
  };
}

export type EmailProperty = {
  id: string;
  name: string;
  caption: string;
  price: string;
  location: string;
  status: string;
  primaryImage?: string;
};

export async function sendWelcomeEmail(
  opts: {
    to: string;
    name?: string | null;
    properties: EmailProperty[];
    allowTestSender?: boolean;
  },
  resendOverride?: EmailClient,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const resend = resendOverride ?? getResend();
  if (!resend) {
    return { ok: false, error: "Missing RESEND_API_KEY" };
  }

  const sender = getConfiguredFrom(opts.allowTestSender);
  if (!sender.ok) {
    return { ok: false, error: sender.error };
  }

  const subject = "From Cloud9 Properties Limited - your Pearls Residence enquiry";
  const html = renderHtml(opts);
  const text = renderText(opts);

  try {
    const res = await resend.emails.send({
      from: sender.from,
      to: opts.to,
      subject,
      html,
      text,
      replyTo: CLOUD9_CONTACT.email,
    });
    if (res.error) {
      return { ok: false, error: res.error.message ?? "send failed" };
    }
    if (!res.data?.id) return { ok: false, error: "no id returned" };
    return { ok: true, id: res.data.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "send failed";
    return { ok: false, error: msg };
  }
}

function renderHtml({
  name,
  properties,
}: {
  name?: string | null;
  properties: EmailProperty[];
}): string {
  const greetingName = name ? escape(name) : "there";
  const propsHtml =
    properties.length === 0 ? "" : properties.map(renderPropertyRow).join("");

  const propsBlock =
    properties.length === 0
      ? ""
      : `
        <tr>
          <td style="padding: 28px 40px 0 40px;">
            <p style="margin: 0 0 4px 0; font-family: 'Courier New', Courier, monospace; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #8a8278;">
              From our conversation
            </p>
            <p style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-style: italic; font-size: 16px; line-height: 1.5; color: #5c564e;">
              The Pearls Residence plot options you spent time with.
            </p>
          </td>
        </tr>
        ${propsHtml}`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>From Cloud9 Properties Limited</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #ede7dd; font-family: Georgia, 'Times New Roman', serif; color: #1a1a1a;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ede7dd;">
      <tr>
        <td align="center" style="padding: 40px 16px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #f6f2ec; border: 1px solid #d9d2c6;">
            <tr>
              <td style="padding: 28px 40px; border-bottom: 1px solid #d9d2c6;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-family: Georgia, serif; font-size: 22px; letter-spacing: 0.18em; color: #1a1a1a;">
                      cloud9
                    </td>
                    <td align="right" style="font-family: 'Courier New', Courier, monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #8a8278;">
                      Pearl Residence / Phase 2
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding: 36px 40px 0 40px;">
                <p style="margin: 0 0 4px 0; font-family: 'Courier New', Courier, monospace; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #8a8278;">
                  From Cloud9 Properties Limited
                </p>
                <p style="margin: 0 0 24px 0; font-family: Georgia, serif; font-size: 28px; line-height: 1.2; color: #1a1a1a; font-style: italic; font-weight: 300;">
                  Dear ${greetingName},
                </p>
                <p style="margin: 0 0 14px 0; font-family: Georgia, serif; font-size: 16px; line-height: 1.65; color: #1a1a1a;">
                  We&rsquo;ve added you to the thread. I will use this to keep your Pearls Residence enquiry moving from our Gwagwalada office.
                </p>
                <p style="margin: 0; font-family: Georgia, serif; font-size: 16px; line-height: 1.65; color: #1a1a1a;">
                  In the meantime, a few notes from our conversation.
                </p>
              </td>
            </tr>

            ${propsBlock}

            <tr>
              <td style="padding: 36px 40px 12px 40px; border-top: 1px solid #d9d2c6;">
                <p style="margin: 28px 0 0 0; font-family: Georgia, serif; font-size: 16px; line-height: 1.65; color: #1a1a1a;">
                  If anything pulls you forward, reply to this note, come back to the conversation, or call Cloud9 on ${escape(CLOUD9_CONTACT.phone)}.
                </p>
                <p style="margin: 22px 0 0 0; font-family: Georgia, serif; font-style: italic; font-size: 16px; color: #5c564e;">
                  &mdash; Your Cloud9 sales representative
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding: 24px 40px 32px 40px;">
                <p style="margin: 0; font-family: 'Courier New', Courier, monospace; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #8a8278;">
                  Cloud9 Properties Limited / ${escape(CLOUD9_CONTACT.email)} / ${escape(CLOUD9_CONTACT.phone)}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function renderPropertyRow(p: EmailProperty): string {
  const name = escape(p.name);
  const caption = escape(p.caption);
  const price = escape(p.price);
  const location = escape(p.location);
  const statusLabel =
    p.status === "available"
      ? ""
      : p.status === "under_offer"
        ? "Under offer"
        : p.status === "reserved"
          ? "Reserved"
          : "Sold";

  const photoCell = p.primaryImage
    ? `
        <td width="160" valign="top" style="padding: 0 20px 0 0;">
          <img src="${escape(p.primaryImage)}" alt="${name}" width="160" height="160" style="display: block; width: 160px; height: 160px; object-fit: cover; border: 1px solid #d9d2c6;" />
        </td>`
    : "";

  return `
    <tr>
      <td style="padding: 20px 40px 0 40px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid #d9d2c6;">
          <tr>
            <td style="padding-top: 20px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  ${photoCell}
                  <td valign="top">
                    <p style="margin: 0 0 4px 0; font-family: Georgia, serif; font-size: 22px; line-height: 1.2; color: #1a1a1a;">
                      ${name}
                    </p>
                    <p style="margin: 0 0 12px 0; font-family: Georgia, serif; font-style: italic; font-size: 14px; line-height: 1.5; color: #5c564e;">
                      ${caption}
                    </p>
                    <p style="margin: 0; font-family: 'Courier New', Courier, monospace; font-size: 12px; letter-spacing: 0.06em; color: #1a1a1a;">
                      ${price} / <span style="color: #5c564e;">${location}</span>${statusLabel ? ` / <span style="color: #a6442c; text-transform: uppercase;">${statusLabel}</span>` : ""}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
}

function renderText({
  name,
  properties,
}: {
  name?: string | null;
  properties: EmailProperty[];
}): string {
  const greetingName = name ? name : "there";
  const lines = [
    "Cloud9 Properties Limited - Pearls Residence enquiry",
    "",
    `Dear ${greetingName},`,
    "",
    "We've added you to the thread. I will use this to keep your Pearls Residence enquiry moving from our Gwagwalada office.",
    "",
    "In the meantime, a few notes from our conversation:",
    "",
  ];

  if (properties.length === 0) {
    lines.push("(No specific Pearls Residence plot options flagged yet.)", "");
  } else {
    for (const p of properties) {
      lines.push(`- ${p.name}`);
      lines.push(`  ${p.caption}`);
      const status =
        p.status !== "available" ? ` / ${p.status.replace("_", " ").toUpperCase()}` : "";
      lines.push(`  ${p.price} / ${p.location}${status}`);
      lines.push("");
    }
  }

  lines.push(
    `If anything pulls you forward, reply to this note, come back to the conversation, or call Cloud9 on ${CLOUD9_CONTACT.phone}.`,
    "",
    "- Your Cloud9 sales representative",
    "",
    `Cloud9 Properties Limited / ${CLOUD9_CONTACT.email} / ${CLOUD9_CONTACT.phone}`,
  );

  return lines.join("\n");
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
