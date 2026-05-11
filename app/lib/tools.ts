import type { ChatCompletionTool } from "openai/resources/chat/completions";
import { prisma } from "./prisma";
import { sendWelcomeEmail, type EmailProperty } from "./email";

// === tool schemas (OpenAI function-calling format) ===

export const TOOLS: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "list_properties",
      description:
        "List land listings in the index. Optionally filter by mood/region tag, by status, or by a max price in NGN. Returns a small summary list - call get_property for details.",
      parameters: {
        type: "object",
        properties: {
          mood: {
            type: "string",
            description:
              "Optional mood/region filter - one of: mixed-use, central, northern, western, southern, growth, infrastructure, greenfield, premium",
          },
          status: {
            type: "string",
            description:
              "Optional status filter — one of: available, under_offer, reserved, sold. Defaults to available.",
          },
          maxPriceUsd: {
            type: "number",
            description:
              "Optional max price in NGN. Best-effort numeric parse of the listed price.",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_property",
      description:
        "Get full details for a single property by id. Returns name, caption, price, location, status, moods, and image URLs.",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Property id, e.g. 'jabi-growth-corridor'",
          },
        },
        required: ["id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "check_availability",
      description:
        "Check availability for a property by id. Returns the current status (available, under_offer, reserved, sold).",
      parameters: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
        required: ["id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "show_property_card",
      description:
        "Surface a single land listing as an inline visual card in the chat. Use this when recommending or referencing a specific parcel so the user sees it.",
      parameters: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
        required: ["id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "save_contact",
      description:
        "Save the user's contact information so the cloud9 sales agent can continue the enquiry or confirm an inspection. Call once you have at least an email or a phone. Update the same fields with name when shared.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string" },
          phone: { type: "string" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "request_contact",
      description:
        "Render a structured inline input field in the chat for the visitor to share their email, phone, or name. ALWAYS use this whenever you want a contact detail — never ask for it in prose alone. Pair it with a one-sentence reason. After calling this, finish your turn; the form will appear and the visitor will submit their value as their next message.",
      parameters: {
        type: "object",
        properties: {
          field: {
            type: "string",
            enum: ["email", "phone", "name"],
            description: "Which piece of contact info to ask for.",
          },
        },
        required: ["field"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "request_inspection_date",
      description:
        "Render a structured list of available inspection dates for the visitor to choose from. ALWAYS use this first when the visitor asks to inspect, visit, tour, view, or schedule a site visit. Do not ask for email or phone until after they choose a date.",
      parameters: {
        type: "object",
        properties: {
          propertyId: {
            type: "string",
            description:
              "Optional property/listing id if the inspection request is for a specific listing.",
          },
        },
      },
    },
  },
];

// === implementations ===

function parseUsd(price: string): number | null {
  // Simple parse for prices like "NGN 420,000,000". Currency-naive.
  const digits = price.replace(/[^0-9]/g, "");
  if (!digits) return null;
  return parseInt(digits, 10);
}

async function noteInterest(sessionId: string, propertyId: string) {
  await prisma.interest.upsert({
    where: { sessionId_propertyId: { sessionId, propertyId } },
    create: { sessionId, propertyId, count: 1 },
    update: { count: { increment: 1 } },
  });
}

async function loadPropertyForResponse(id: string) {
  const p = await prisma.property.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });
  if (!p) return null;
  return {
    id: p.id,
    name: p.name,
    caption: p.caption,
    price: p.price,
    location: p.location,
    status: p.status,
    available: p.available,
    moods: JSON.parse(p.moods) as string[],
    images: p.images.map((i) => ({
      url: i.url,
      alt: i.alt,
      isPrimary: i.isPrimary,
    })),
  };
}

export async function runTool(
  name: string,
  args: Record<string, unknown>,
  sessionId: string,
): Promise<{
  result: unknown;
  uiCard?: { propertyId: string };
  uiContactRequest?: { field: "email" | "phone" | "name" };
  uiInspectionDates?: { dates: InspectionDateOption[] };
}> {
  switch (name) {
    case "list_properties": {
      const where: Record<string, unknown> = {};
      const status = (args.status as string | undefined) ?? "available";
      where.status = status;

      const all = await prisma.property.findMany({
        where,
        include: { images: { where: { isPrimary: true }, take: 1 } },
        orderBy: { name: "asc" },
      });

      let filtered = all.map((p) => ({
        id: p.id,
        name: p.name,
        caption: p.caption,
        price: p.price,
        location: p.location,
        status: p.status,
        moods: JSON.parse(p.moods) as string[],
        photo: p.images[0]?.url,
      }));

      if (args.mood && typeof args.mood === "string") {
        filtered = filtered.filter((p) => p.moods.includes(args.mood as string));
      }

      if (args.maxPriceUsd && typeof args.maxPriceUsd === "number") {
        filtered = filtered.filter((p) => {
          const n = parseUsd(p.price);
          return n !== null && n <= (args.maxPriceUsd as number);
        });
      }

      return { result: { count: filtered.length, properties: filtered } };
    }

    case "get_property": {
      const id = String(args.id);
      const p = await loadPropertyForResponse(id);
      if (!p) return { result: { error: "not_found" } };
      await noteInterest(sessionId, id);
      return { result: p };
    }

    case "check_availability": {
      const id = String(args.id);
      const p = await prisma.property.findUnique({ where: { id } });
      if (!p) return { result: { error: "not_found" } };
      return {
        result: {
          id: p.id,
          name: p.name,
          status: p.status,
          available: p.available,
        },
      };
    }

    case "show_property_card": {
      const id = String(args.id);
      const p = await loadPropertyForResponse(id);
      if (!p) return { result: { error: "not_found" } };
      await noteInterest(sessionId, id);
      // The result is sent back to the model AND to the UI (via uiCard signal).
      return {
        result: {
          ok: true,
          rendered: { id: p.id, name: p.name },
        },
        uiCard: { propertyId: p.id },
      };
    }

    case "request_contact": {
      const field = args.field as "email" | "phone" | "name" | undefined;
      if (!field || !["email", "phone", "name"].includes(field)) {
        return { result: { error: "invalid_field" } };
      }
      return {
        result: { status: "form_shown", field },
        uiContactRequest: { field },
      };
    }

    case "request_inspection_date": {
      const propertyId =
        typeof args.propertyId === "string" ? args.propertyId : undefined;
      const dates = getAvailableInspectionDates();
      return {
        result: {
          status: "date_options_shown",
          propertyId,
          dates,
        },
        uiInspectionDates: { dates },
      };
    }

    case "save_contact": {
      const name = (args.name as string | undefined) ?? undefined;
      const email = (args.email as string | undefined) ?? undefined;
      const phone = (args.phone as string | undefined) ?? undefined;

      const before = await prisma.session.findUnique({
        where: { id: sessionId },
      });

      const data: Record<string, unknown> = {};
      if (name) data.name = name;
      if (email) data.email = email;
      if (phone) data.phone = phone;
      if (email || phone) data.isLead = true;

      await prisma.session.update({
        where: { id: sessionId },
        data,
      });

      // Fire welcome email when an email is captured for the first time and we
      // haven't sent one yet for this session. Fire-and-forget — don't block
      // the chat reply on email delivery.
      const isNewEmail = email && before?.email !== email;
      const alreadySent =
        (before as { welcomeEmailSentAt?: Date | null } | null)
          ?.welcomeEmailSentAt ?? null;

      if (isNewEmail && !alreadySent) {
        void deliverWelcome(sessionId, email, name ?? before?.name ?? null);
      }

      return { result: { ok: true, captured: data } };
    }

    default:
      return { result: { error: `unknown tool ${name}` } };
  }
}

export type InspectionDateOption = {
  value: string;
  label: string;
  window: string;
};

function getAvailableInspectionDates(): InspectionDateOption[] {
  const dates: InspectionDateOption[] = [];
  const cursor = new Date();
  cursor.setDate(cursor.getDate() + 1);

  while (dates.length < 5) {
    const day = cursor.getDay();
    const isSunday = day === 0;

    if (!isSunday) {
      const value = cursor.toISOString().slice(0, 10);
      const label = new Intl.DateTimeFormat("en-NG", {
        weekday: "short",
        month: "short",
        day: "numeric",
        timeZone: "Africa/Lagos",
      }).format(cursor);
      const window = day === 6 ? "10:00 AM - 1:00 PM" : "10:00 AM - 3:00 PM";
      dates.push({ value, label, window });
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
}

async function deliverWelcome(
  sessionId: string,
  email: string,
  name: string | null,
) {
  try {
    // Pull this session's top property interests for the email.
    const interests = await prisma.interest.findMany({
      where: { sessionId },
      include: {
        property: { include: { images: { where: { isPrimary: true }, take: 1 } } },
      },
      orderBy: [{ count: "desc" }, { updatedAt: "desc" }],
      take: 4,
    });

    const properties: EmailProperty[] = interests.map((i) => ({
      id: i.property.id,
      name: i.property.name,
      caption: i.property.caption,
      price: i.property.price,
      location: i.property.location,
      status: i.property.status,
      primaryImage: i.property.images[0]?.url,
    }));

    const result = await sendWelcomeEmail({ to: email, name, properties });

    if (result.ok) {
      // Stamp via raw SQL because the field was added in a recent migration
      // and the generated TS client may not yet expose it on this build.
      await prisma.$executeRaw`UPDATE Session SET welcomeEmailSentAt = ${new Date()} WHERE id = ${sessionId}`;
      console.log(`[email] welcome sent to ${email} (id=${result.id})`);
    } else {
      console.warn(`[email] welcome failed for ${email}: ${result.error}`);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    console.warn(`[email] deliverWelcome threw: ${msg}`);
  }
}
