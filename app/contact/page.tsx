import type { Metadata } from "next";
import { InquiryForm } from "@/components/contact/InquiryForm";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Book a Shoot",
  description:
    "Book concert, event, or headshot photography in Gainesville or Winter Park, FL with Jackson Kracht.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="gutter pb-20 pt-28 md:pb-28 md:pt-36">
      <div className="grid gap-12 md:grid-cols-12 md:gap-x-5">
        <div className="md:col-span-5">
          <p className="meta mb-6">Bookings</p>
          <h1 className="display text-[clamp(3.6rem,10vw,9rem)]">Book a shoot</h1>
          <p className="mt-6 text-lg text-bone/85">Have a shoot in mind? Get in touch.</p>
          <dl className="mt-10 space-y-5 border-t border-line pt-6">
            <div>
              <dt className="meta mb-1.5">Email</dt>
              <dd>
                <a className="link-line text-lg text-bone" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="meta mb-1.5">Based in</dt>
              <dd className="text-bone">{site.location}</dd>
            </div>
          </dl>
        </div>
        <div className="md:col-span-6 md:col-start-7 md:pt-3">
          <InquiryForm />
        </div>
      </div>
    </div>
  );
}
