"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState, type FormEvent } from "react";
import { site } from "@/content/site";
import { LIMITS, normalize, shootTypes, validate, type Inquiry, type InquiryErrors } from "@/lib/inquiry";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent"; email: string }
  | { kind: "error"; message: string };

const fieldBase =
  "w-full border-0 border-b bg-transparent px-0 pb-3 pt-2 text-lg text-bone placeholder:text-ash focus:outline-none focus-visible:outline-none transition-colors";

function errorMessage(code: string | undefined) {
  switch (code) {
    case "not_configured":
      return `Online booking isn’t connected yet, so your inquiry wasn’t sent. Email ${site.email} instead.`;
    case "rate_limited":
      return `Too many inquiries from this connection. Wait a few minutes, or email ${site.email}.`;
    case "invalid":
      return "Some fields need fixing. Check the highlighted fields.";
    default:
      return `Your inquiry didn’t go through. Try again, or email ${site.email}.`;
  }
}

export function InquiryForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [startedAt] = useState(() => Date.now());
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Inquiry, boolean>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const read = () => normalize(Object.fromEntries(new FormData(formRef.current!)));

  const onBlur = (name: keyof Inquiry) => {
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors(validate(read()));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const values = read();
    const found = validate(values);
    setErrors(found);
    setTouched({ name: true, email: true, type: true, date: true, location: true, message: true });
    const first = Object.keys(found)[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus({ kind: "sending" });
    try {
      const data = Object.fromEntries(new FormData(formRef.current!));
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, startedAt }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; errors?: InquiryErrors };
      if (res.ok && json.ok) {
        setStatus({ kind: "sent", email: values.email });
        return;
      }
      if (json.errors) setErrors(json.errors);
      setStatus({ kind: "error", message: errorMessage(json.error) });
    } catch {
      setStatus({ kind: "error", message: errorMessage(undefined) });
    }
  };

  const show = (name: keyof Inquiry) => (touched[name] ? errors[name] : undefined);

  const field = ({
    name,
    label,
    optional,
    children,
  }: {
    name: keyof Inquiry;
    label: string;
    optional?: boolean;
    children: React.ReactNode;
  }) => (
    <div>
      <label htmlFor={`f-${name}`} className="meta flex justify-between">
        <span>{label}</span>
        {optional && <span className="normal-case tracking-normal text-ash">Optional</span>}
      </label>
      {children}
      <p id={`f-${name}-error`} className="mt-2 min-h-5 text-sm text-ember" aria-live="polite">
        {show(name)}
      </p>
    </div>
  );

  const border = (name: keyof Inquiry) =>
    show(name) ? "border-ember" : "border-line focus:border-bone hover:border-ash";
  const aria = (name: keyof Inquiry) => ({
    "aria-invalid": show(name) ? true : undefined,
    "aria-describedby": `f-${name}-error`,
  });

  if (status.kind === "sent") {
    return (
      <motion.div
        role="status"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-t border-line pt-10"
      >
        <p className="display text-[clamp(3rem,7vw,6rem)]">Inquiry sent.</p>
        <p className="mt-6 max-w-md text-lg text-ash">
          Thanks. I’ll reply to <span className="text-bone">{status.email}</span>. If it’s urgent, email{" "}
          <a className="link-line text-bone" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          .
        </p>
      </motion.div>
    );
  }

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="grid gap-x-8 gap-y-6 md:grid-cols-2">
      {/* Hidden from people; bots tend to fill it. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="f-website">Website</label>
        <input id="f-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {field({
        name: "name",
        label: "Name",
        children: (
          <input
            id="f-name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={LIMITS.name}
            required
            onBlur={() => onBlur("name")}
            className={`${fieldBase} ${border("name")}`}
            {...aria("name")}
          />
        ),
      })}

      {field({
        name: "email",
        label: "Email",
        children: (
          <input
            id="f-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            maxLength={LIMITS.email}
            required
            onBlur={() => onBlur("email")}
            className={`${fieldBase} ${border("email")}`}
            {...aria("email")}
          />
        ),
      })}

      <div className="md:col-span-2">
        {field({
          name: "type",
          label: "What should I photograph?",
          children: (
            <div className="relative">
              <select
                id="f-type"
                name="type"
                required
                defaultValue=""
                onBlur={() => onBlur("type")}
                className={`${fieldBase} ${border("type")} appearance-none pr-8`}
                {...aria("type")}
              >
                <option value="" disabled>
                  Choose one
                </option>
                {shootTypes.map((t) => (
                  <option key={t.value} value={t.value} className="bg-graphite">
                    {t.label}
                  </option>
                ))}
              </select>
              <span aria-hidden className="pointer-events-none absolute right-0 top-3 text-ash">
                ↓
              </span>
            </div>
          ),
        })}
      </div>

      {field({
        name: "date",
        label: "Date",
        optional: true,
        children: (
          <input
            id="f-date"
            name="date"
            type="date"
            onBlur={() => onBlur("date")}
            className={`${fieldBase} ${border("date")} [color-scheme:dark]`}
            {...aria("date")}
          />
        ),
      })}

      {field({
        name: "location",
        label: "Location",
        optional: true,
        children: (
          <input
            id="f-location"
            name="location"
            type="text"
            autoComplete="off"
            placeholder="Venue, field, or campus spot"
            maxLength={LIMITS.location}
            onBlur={() => onBlur("location")}
            className={`${fieldBase} ${border("location")}`}
            {...aria("location")}
          />
        ),
      })}

      <div className="md:col-span-2">
        {field({
          name: "message",
          label: "Details",
          children: (
            <textarea
              id="f-message"
              name="message"
              rows={5}
              required
              maxLength={LIMITS.message}
              placeholder="What’s happening, how long you need coverage, and how you’ll use the photos."
              onBlur={() => onBlur("message")}
              className={`${fieldBase} ${border("message")} resize-y`}
              {...aria("message")}
            />
          ),
        })}
      </div>

      <div className="flex flex-col gap-5 md:col-span-2 md:flex-row md:items-center md:justify-between">
        <button
          type="submit"
          disabled={status.kind === "sending"}
          className="group inline-flex items-center justify-center gap-3 bg-bone px-7 py-4 text-sm font-medium text-ink transition-colors hover:bg-white disabled:cursor-wait disabled:opacity-70"
        >
          {status.kind === "sending" ? "Sending…" : "Send inquiry"}
          <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
            →
          </span>
        </button>
        <AnimatePresence>
          {status.kind === "error" && (
            <motion.p
              role="alert"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-md text-sm text-ember"
            >
              {status.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
