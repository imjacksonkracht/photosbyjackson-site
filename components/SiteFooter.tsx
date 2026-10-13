import Link from "next/link";
import { site } from "@/content/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const link = "link-line text-sm text-bone/85 hover:text-bone";
  return (
    <footer className="gutter border-t border-line pb-8 pt-12 md:pt-16">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <Link href="/" className="display text-[clamp(2.6rem,6vw,5rem)] text-bone">
          Photos by Jackson
        </Link>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-7 gap-y-3">
            <li>
              <Link className={link} href="/contact">
                Contact
              </Link>
            </li>
            <li>
              <a className={link} href={site.instagram.url} rel="me noopener" target="_blank">
                Instagram ↗
              </a>
            </li>
            <li>
              <a className={link} href={site.galleries}>
                Client Galleries ↗
              </a>
            </li>
            <li>
              <a className={link} href={site.personalSite} rel="noopener" target="_blank">
                jacksonkracht.com ↗
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <p className="meta mt-10 border-t border-line pt-5">
        © {year} {site.name}
      </p>
    </footer>
  );
}
