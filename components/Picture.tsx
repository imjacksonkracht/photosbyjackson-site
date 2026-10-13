import type { CSSProperties } from "react";
import { fallbackSrc, photo as getPhoto, srcSet, type Photo } from "@/content/photos";

type Props = {
  id: string;
  /** Responsive sizes hint, e.g. "(min-width: 1024px) 60vw, 100vw". */
  sizes: string;
  /**
   * Presentation crop as width/height (e.g. 16 / 9). Omit to show the photo
   * at its natural ratio. Cropping is CSS only; the file is untouched.
   */
  ratio?: number;
  /** Fill the parent box instead of sizing by ratio. */
  fill?: boolean;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  alt?: string;
};

export function Picture({ id, sizes, ratio, fill, priority, className = "", imgClassName = "", alt }: Props) {
  const p: Photo = getPhoto(id);
  const style: CSSProperties & Record<"--focus", string> = {
    backgroundColor: p.color,
    backgroundImage: `url(${p.blur})`,
    "--focus": p.focus ?? "50% 50%",
    ...(fill ? {} : { aspectRatio: `${ratio ?? p.aspect}` }),
  };

  return (
    <div className={`photo-frame ${fill ? "absolute inset-0" : ""} ${className}`} style={style}>
      <picture>
        <source type="image/avif" srcSet={srcSet(p)} sizes={sizes} />
        <img
          src={fallbackSrc(p)}
          alt={alt ?? p.alt}
          width={p.width}
          height={p.height}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding={priority ? "sync" : "async"}
          className={imgClassName}
          style={{ objectPosition: p.focus ?? "50% 50%" }}
        />
      </picture>
    </div>
  );
}
