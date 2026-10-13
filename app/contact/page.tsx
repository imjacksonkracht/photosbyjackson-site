import type { Metadata } from "next";
import { InquiryForm } from "@/components/contact/InquiryForm";
import { Picture } from "@/components/Picture";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Book a Shoot",
  description:
    "Book concert, event, or headshot photography in Gainesville, FL with Jackson Kracht. Send an inquiry or email jackson@photosbyjackson.org.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="gutter pb-28 pt-32 md:pb-40 md:pt-44">
      <div className="grid gap-16 md:grid-cols-12 md:gap-x-6">
        <div className="md:col-span-5">
          <p className="meta mb-8">Bookings</p>
          <h1 className="display text-[clamp(4rem,11vw,10rem)]">Book a shoot</h1>
          <p className="mt-8 max-w-md text-lg leading-relaxed text-bone/90">
            Tell me what you’re planning. I’ll reply by email with availability and pricing for your shoot.
          </p>
          <dl className="mt-12 space-y-6 border-t border-line pt-8">
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
            <div>
              <dt className="meta mb-1.5">Client galleries</dt>
              <dd>
                <a className="link-line text-bone" href={site.galleries}>
                  galleries.photosbyjackson.org ↗
                </a>
              </dd>
            </div>
          </dl>
          <div className="mt-14 hidden w-3/4 md:block">
            <Picture id="live-from-the-lawn-acoustic-guitarist-02" ratio={2 / 3} sizes="25vw" />
          </div>
        </div>
        <div className="md:col-span-6 md:col-start-7 md:pt-40">
          <InquiryForm />
        </div>
      </div>
    </div>
  );
}
