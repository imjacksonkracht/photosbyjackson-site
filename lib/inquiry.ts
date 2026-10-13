// Inquiry validation shared by the contact form and the API route.

export const shootTypes = [
  { value: "music", label: "Concert or live music" },
  { value: "event", label: "Event or organization" },
  { value: "portrait", label: "Portraits or headshots" },
  { value: "other", label: "Something else" },
] as const;

export type Inquiry = {
  name: string;
  email: string;
  type: string;
  date: string;
  location: string;
  message: string;
};

export type InquiryErrors = Partial<Record<keyof Inquiry, string>>;

export const LIMITS = { name: 100, email: 200, location: 200, message: 4000 } as const;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalize(input: Record<string, unknown>): Inquiry {
  const s = (k: string) => (typeof input[k] === "string" ? (input[k] as string).trim() : "");
  return {
    name: s("name"),
    email: s("email"),
    type: s("type"),
    date: s("date"),
    location: s("location"),
    message: s("message"),
  };
}

export function validate(v: Inquiry): InquiryErrors {
  const e: InquiryErrors = {};
  if (!v.name) e.name = "Enter your name.";
  else if (v.name.length > LIMITS.name) e.name = `Keep your name under ${LIMITS.name} characters.`;

  if (!v.email) e.email = "Enter your email so I can reply.";
  else if (v.email.length > LIMITS.email || !EMAIL.test(v.email)) e.email = "Enter an email like name@example.com.";

  if (!shootTypes.some((t) => t.value === v.type)) e.type = "Choose what you’d like photographed.";

  if (v.date && !/^\d{4}-\d{2}-\d{2}$/.test(v.date)) e.date = "Enter the date as YYYY-MM-DD.";

  if (v.location.length > LIMITS.location) e.location = `Keep the location under ${LIMITS.location} characters.`;

  if (v.message.length < 10) e.message = "Add a few details about the shoot (at least 10 characters).";
  else if (v.message.length > LIMITS.message) e.message = `Keep the message under ${LIMITS.message} characters.`;

  return e;
}
