import Image from "next/image";
import { Play } from "lucide-react";

/**
 * Bloc média.
 *
 * Tant qu'aucune image n'est fournie, affiche un emplacement rayé
 * portant son libellé — c'est volontaire, ça montre ce qui manque
 * au lieu de laisser un trou.
 */
export function Media({
  src,
  alt,
  ratio = "169",
  className = "",
  children,
  onError,
}: {
  src?: string;
  alt: string;
  ratio?: "169" | "916" | "11" | "43";
  className?: string;
  children?: React.ReactNode;
  onError?: () => void;
}) {
  return (
    <div className={`tl-media tl-media--${ratio} ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 700px) 100vw, 45vw"
          style={{ objectFit: "cover" }}
          onError={onError}
        />
      ) : (
        <span className="tl-media__tag">{alt}</span>
      )}
      {children}
    </div>
  );
}

export function IconePlay() {
  return (
    <span className="tl-play" aria-hidden="true">
      <Play size={20} />
    </span>
  );
}

