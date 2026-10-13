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
  projects,
} from "@/content/projects";
import { site } from "@/content/site";
import { JsonLd } from "@/lib/jsonld";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const cover = photo(project.cover);
  const category = categories[project.category].label.toLowerCase();
  const image = shareImage(project.slug);
  return {
    title: project.title,
    description: `${project.summary} ${category[0].toUpperCase()}${category.slice(1)} photography by ${site.photographer}.`,
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
  const count = photosIn(project).length;
  const category = categories[project.category];

  const facts = [
    project.date && { term: "Date", value: formatDate(project.date) },
    project.location && { term: "Location", value: project.location },
    { term: "Category", value: category.label },
    { term: "Photographs", value: String(count) },
  ].filter(Boolean) as { term: string; value: string }[];

  const ld = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: project.title,
    description: project.summary,
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
      <header className="gutter pb-16 pt-32 md:pb-24 md:pt-44">
        <nav aria-label="Breadcrumb" className="meta mb-10 flex gap-3">
          <Link href="/work" className="link-line hover:text-bone">
            Work
          </Link>
          <span aria-hidden>/</span>
          <Link href={`/work/${project.category}`} className="link-line hover:text-bone">
            {category.label}
          </Link>
        </nav>
        <h1 className="display text-[clamp(3.6rem,13vw,13rem)]">{project.title}</h1>
        <div className="mt-10 grid gap-10 border-t border-line pt-6 md:mt-14 md:grid-cols-12">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 md:col-span-6 md:grid-cols-4">
            {facts.map((f) => (
              <div key={f.term}>
                <dt className="meta mb-1.5">{f.term}</dt>
                <dd className="text-sm text-bone">{f.value}</dd>
              </div>
            ))}
          </dl>
          <div className="md:col-span-5 md:col-start-8">
            <p className="text-lg leading-relaxed text-bone/90">{project.summary}</p>
            {project.galleryUrl && (
              <a
                href={project.galleryUrl}
                className="group mt-6 inline-flex items-center gap-2 text-sm text-bone"
              >
                <span className="link-line pb-0.5">Full gallery and downloads</span>
                <span aria-hidden className="text-ember transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                  ↗
                </span>
              </a>
            )}
          </div>
        </div>
      </header>

      <Sequence rows={project.sequence} title={project.title} />

      {project.galleryUrl && (
        <div className="gutter mt-20 flex justify-center md:mt-32">
          <a
            href={project.galleryUrl}
            className="display-medium link-line pb-1 text-[clamp(1.4rem,2.4vw,2rem)] text-bone"
          >
            See the full gallery ↗
          </a>
        </div>
      )}

      <nav aria-label="More projects" className="mt-24 grid border-t border-line md:mt-36 md:grid-cols-2">
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
