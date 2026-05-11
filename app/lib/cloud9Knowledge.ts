export const CLOUD9_CONTACT = {
  phone: "09167879100",
  email: "Cloud9propertieslimited@gmail.com",
  office:
    "Suite 01, Former Agric House, beside Mobil Filling Station (just past Sajumah Plaza), Gwagwalada",
  fullAddress:
    "Suite 01, Former Agric House, beside Mobil Filling Station (just past Sajumah Plaza), Gwagwalada 902101, Federal Capital Territory",
};

export const CLOUD9_COMPANY = {
  name: "Cloud9 Properties Limited",
  founded: "2023",
  location: "Gwagwalada, Abuja",
  promise:
    "Cloud9 makes buying, selling, investing in, and managing real estate simple, transparent, secure, and rewarding.",
  mission:
    "To simplify real estate for the modern generation by delivering trusted, innovative, and personalized property solutions from buying and selling to seamless property management.",
  vision:
    "To redefine the real estate experience for a new era, building lasting relationships, setting industry standards, and becoming the go-to property partner for every generation.",
  figures: [
    "100+ trusted clients",
    "5+ estates developed across Gwagwalada",
    "5,000+ plots of land sold across the country",
  ],
  team: [
    { name: "Ibrahim Quassim", title: "Chief Executive Officer" },
    { name: "Ojewale Omotayo Loveth", title: "Chief Operating Officer" },
  ],
};

export const CLOUD9_SERVICES = [
  {
    name: "Property sales",
    summary:
      "Cloud9 helps clients buy and sell residential and commercial properties with transparent guidance from listing to closing.",
  },
  {
    name: "Property investment",
    summary:
      "Cloud9 guides first-time and seasoned investors toward profitable, data-driven real estate opportunities for long-term growth.",
  },
  {
    name: "Property management",
    summary:
      "Cloud9 supports tenant screening, rent collection, maintenance, and compliance so owners can manage property with less stress.",
  },
  {
    name: "Property search assistance",
    summary:
      "Cloud9 helps clients find suitable property options based on budget, lifestyle, and goals.",
  },
  {
    name: "Market analysis and consulting",
    summary:
      "Cloud9 provides market research, trend insight, and pricing guidance for smarter real estate decisions.",
  },
];

export const CLOUD9_PROJECT = {
  name: "Cloud9 Pearl Residence Phase 2",
  location: "Gwagwalada, Abuja",
  summary:
    "Cloud9 Pearl Residence Phase 2 is positioned in Gwagwalada's fast-growing property zone with verified documentation, prime access, and strong capital appreciation potential.",
  claims: [
    "Verified land titles",
    "Prime access in Gwagwalada",
    "Transparent documentation",
    "Flexible payment options available",
    "Strong appreciation potential within 12-24 months in high-growth zones",
  ],
};

export const CLOUD9_FAQS = [
  {
    question: "What makes Cloud9 different from other real estate companies?",
    answer:
      "Cloud9 stands out for transparency, professionalism, verified properties, clear documentation, and real investment value.",
  },
  {
    question: "Does Cloud9 only sell land or also develop properties?",
    answer:
      "Cloud9 does both. The company offers land banking opportunities and develops residential and commercial properties.",
  },
  {
    question: "How secure are Cloud9 investments?",
    answer:
      "Cloud9 says every property is carefully vetted and verified by its legal and technical team, with clean titles, transparent documentation, and due process.",
  },
  {
    question: "Can I pay in installments?",
    answer:
      "Yes. Cloud9 offers flexible payment plans, with short or long-term installment options depending on the project.",
  },
  {
    question: "What kind of returns should I expect?",
    answer:
      "Returns vary by location and property type, but Cloud9 selects properties for strong appreciation potential. Most clients see value growth within 12-24 months, especially in high-growth zones.",
  },
  {
    question: "Does Cloud9 help manage or resell properties?",
    answer:
      "Yes. Cloud9 offers post-purchase support, including property management and resale assistance.",
  },
  {
    question: "How do I start investing with Cloud9?",
    answer:
      "Book a consultation or visit the Cloud9 office to explore available projects. The team guides buyers through property selection, verification, and payment.",
  },
];

export function renderCloud9KnowledgeForPrompt() {
  const services = CLOUD9_SERVICES.map(
    (service) => `- ${service.name}: ${service.summary}`,
  ).join("\n");
  const faqs = CLOUD9_FAQS.map(
    (faq) => `- Q: ${faq.question}\n  A: ${faq.answer}`,
  ).join("\n");
  const figures = CLOUD9_COMPANY.figures.map((item) => `- ${item}`).join("\n");
  const claims = CLOUD9_PROJECT.claims.map((item) => `- ${item}`).join("\n");
  const team = CLOUD9_COMPANY.team
    .map((member) => `- ${member.name}: ${member.title}`)
    .join("\n");

  return `
# Cloud9 company facts
- Company: ${CLOUD9_COMPANY.name}
- Founded: ${CLOUD9_COMPANY.founded}
- Base: ${CLOUD9_COMPANY.location}
- Promise: ${CLOUD9_COMPANY.promise}
- Mission: ${CLOUD9_COMPANY.mission}
- Vision: ${CLOUD9_COMPANY.vision}

# Facts and figures
${figures}

# Main project
- Project: ${CLOUD9_PROJECT.name}
- Location: ${CLOUD9_PROJECT.location}
- Summary: ${CLOUD9_PROJECT.summary}

# Project claims
${claims}

# Services
${services}

# Team
${team}

# Public contact details
- WhatsApp/Calls: ${CLOUD9_CONTACT.phone}
- Email: ${CLOUD9_CONTACT.email}
- Office: ${CLOUD9_CONTACT.office}

# Website FAQ
${faqs}
`.trim();
}
