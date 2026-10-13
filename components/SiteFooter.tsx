import Link from "next/link";
import { site } from "@/content/site";
import { categories, categoryOrder } from "@/content/projects";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="gutter border-t border-line pb-10 pt-16 md:pt-20">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="display text-[clamp(3rem,9vw,7.5rem)] text-bone">Photos by Jackson</p>
          <p className="mt-5 max-w-sm text-sm text-ash">
            {site.photographer}. Concerts, events, and portraits in {site.location}.
          </p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 md:col-span-6 md:grid-cols-[1fr_1fr_auto]">
          <div>
            <p className="meta mb-4">Work</p>
            <ul className="space-y-2 text-sm">
              {categoryOrder.map((c) => (
                <li key={c}>
                  <Link className="link-line" href={`/work/${c}`}>
                    {categories[c].label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="meta mb-4">Studio</p>
            <ul className="space-y-2 text-sm">
              <li><Link className="link-line" href="/about">About</Link></li>
              <li><Link className="link-line" href="/contact">Book a shoot</Link></li>
              <li><a className="link-line" href={site.galleries}>Client galleries ↗</a></li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="meta mb-4">Contact</p>
            <ul className="space-y-2 text-sm">
              <li><a className="link-line break-all" href={`mailto:${site.email}`}>{site.email}</a></li>
              <li><a className="link-line" href={site.instagram.url} rel="me noopener" target="_blank">Instagram ↗</a></li>
              <li><a className="link-line" href={site.personalSite} rel="noopener" target="_blank">jacksonkracht.com ↗</a></li>
            </ul>
          </div>
        </nav>
      </div>
      <div className="meta mt-16 flex flex-col justify-between gap-2 border-t border-line pt-6 sm:flex-row">
        <p>© {year} {site.name}</p>
        <p>{site.locationShort}</p>
      </div>
    </footer>
  );
}
