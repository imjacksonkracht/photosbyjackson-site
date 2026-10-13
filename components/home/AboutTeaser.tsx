import Link from "next/link";
import { Picture } from "@/components/Picture";
import { hasPhoto } from "@/content/photos";

const BTS = "jackson-behind-the-scenes";

export function AboutTeaser() {
  return (
    <section aria-labelledby="about-title" className="gutter border-t border-line py-20 md:py-28">
      <div className="grid items-center gap-8 md:grid-cols-12 md:gap-x-5">
        {hasPhoto(BTS) && (
          <div className="md:col-span-4">
            <Picture id={BTS} ratio={4 / 5} sizes="(min-width: 768px) 33vw, 100vw" />
          </div>
        )}
        <div className="md:col-span-7 md:col-start-6">
          <h2 id="about-title" className="display text-[clamp(2.8rem,7vw,6.5rem)]">
            Hey, I’m Jackson.
          </h2>
          <p className="mt-5 max-w-lg text-xl leading-relaxed text-bone/85">
            I’m a photographer and student at the University of Florida. I shoot concerts, campus events, and
            portraits.
          </p>
          <Link href="/about" className="link-line mt-6 inline-block pb-0.5 text-sm">
            More about me
          </Link>
        </div>
      </div>
    </section>
  );
}
