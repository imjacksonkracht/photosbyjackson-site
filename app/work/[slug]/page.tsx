import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingCTA } from "@/components/BookingCTA";
import { Picture } from "@/components/Picture";
import { Sequence } from "@/components/project/Sequence";
import { fallbackSrc, photo, shareImage } from "@/content/photos";
import {
  adjacentProjects,
  categories,
  formatDate,
  getProject,
  photosIn,
  projectLabel,
  projects,
  type Project,
} from "@/content/projects";
import { site } from "@/content/site";
import { JsonLd } from "@/lib/jsonld";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

/** Meta description built from verified facts only. */
function describe(p: Project) {
  const when = p.date ? ` on ${formatDate(p.date)}` : "";
  const where = p.location ? ` in ${p.location}` : "";
  return `${p.title}: ${projectLabel(p).toLowerCase()} photography by ${site.photographer}${where}${when}.`;
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const cover = photo(project.cover);
  const image = shareImage(project.slug);
  return {
    title: project.title,
    description: describe(project),
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: "article",
      url: `/work/${project.slug}`,
      images: [{ url: image, width: 1200, height: 630, alt: cover.alt }],
    },
    twitter: { card: "summary_large_image", images: [image] },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { prev, next } = adjacentProjects(slug);
  const category = categories[project.category];
  const facts = [projectLabel(project), project.date && formatDate(project.date), project.location].filter(
    Boolean,
  ) as string[];

  const ld = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: project.title,
    description: describe(project),
    url: `${site.url}/work/${project.slug}`,
    ...(project.date ? { dateCreated: project.date } : {}),
    author: { "@type": "Person", name: site.photographer },
    image: photosIn(project).map((id) => ({
      "@type": "ImageObject",
      contentUrl: `${site.url}${fallbackSrc(photo(id))}`,
      description: photo(id).alt,
      creator: { "@type": "Person", name: site.photographer },
    })),
  };

  return (
    <article>
      <JsonLd data={ld} />
      <header className="gutter pb-8 pt-28 md:pb-12 md:pt-36">
        <nav aria-label="Breadcrumb" className="meta mb-6 flex gap-3">
          <Link href="/work" className="link-line hover:text-bone">
            Work
          </Link>
          <span aria-hidden>/</span>
          <Link href={`/work/${project.category}`} className="link-line hover:text-bone">
            {category.label}
          </Link>
        </nav>
        <h1 className="display text-[clamp(3.2rem,10vw,10rem)]">{project.title}</h1>
        <div className="mt-6 flex flex-col gap-3 border-t border-line pt-4 md:flex-row md:items-center md:justify-between">
          <p className="meta flex flex-wrap gap-x-3 gap-y-1 text-bone/80">
            {facts.map((f, i) => (
              <span key={f}>
                {i > 0 && <span aria-hidden className="mr-3 text-ash">/</span>}
                {f}
              </span>
            ))}
          </p>
          {project.galleryUrl && (
            <a href={project.galleryUrl} className="group meta inline-flex items-center gap-2 text-bone">
              <span className="link-line pb-0.5">Full gallery</span>
              <span aria-hidden className="text-ember">↗</span>
            </a>
          )}
        </div>
      </header>

      <Sequence rows={project.sequence} title={project.title} />

      {project.galleryUrl && (
        <div className="gutter mt-12 flex justify-center md:mt-16">
          <a
            href={project.galleryUrl}
            className="display-medium link-line pb-1 text-[clamp(1.4rem,2.4vw,2rem)] text-bone"
          >
            See the full gallery ↗
          </a>
        </div>
      )}

      <nav aria-label="More projects" className="mt-14 grid border-t border-line md:mt-20 md:grid-cols-2">
        {[
          { label: "Previous", p: prev },
          { label: "Next", p: next },
        ].map(({ label, p }, i) => (
          <Link
            key={label}
            href={`/work/${p.slug}`}
            className={`group gutter relative flex min-h-56 items-end overflow-hidden py-8 md:min-h-80 ${
              i === 0 ? "border-b border-line md:border-b-0 md:border-r" : "md:justify-end md:text-right"
            }`}
          >
            <Picture id={p.cover} fill sizes="50vw" className="zoom opacity-40 transition-opacity duration-700 group-hover:opacity-70" />
            <div className="relative">
              <p className="meta mb-3 text-bone/80">
                {i === 0 ? "← " : ""}
                {label}
                {i === 1 ? " →" : ""}
              </p>
              <p className="display text-[clamp(2.4rem,5vw,4.5rem)] text-bone">{p.title}</p>
            </div>
          </Link>
        ))}
      </nav>

      <BookingCTA />
    </article>
  );
}
