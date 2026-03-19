import Image from "next/image";

interface SceneImageProps {
  src: string;
  alt: string;
}

/**
 * Renders the hero artwork as a full-coverage background.
 * No transforms here — parallax is applied by the parent wrapper in HeroScene.
 */
export function SceneImage({ src, alt }: SceneImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority
      draggable={false}
      className="object-cover select-none pointer-events-none"
      sizes="100vw"
    />
  );
}
