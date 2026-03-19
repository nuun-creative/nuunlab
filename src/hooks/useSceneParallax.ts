import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

interface ParallaxOffset {
  x: number;
  y: number;
}

export function useSceneParallax(strength = 20): ParallaxOffset {
  const [offset, setOffset] = useState<ParallaxOffset>({ x: 0, y: 0 });
  const reducedMotion = useReducedMotion();
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (reducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const x = ((e.clientX - cx) / cx) * strength;
        const y = ((e.clientY - cy) / cy) * strength;
        setOffset({ x, y });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion, strength]);

  return offset;
}
