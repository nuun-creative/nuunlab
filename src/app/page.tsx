import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { HeroScene } from "@/components/game/HeroScene";

export const metadata: Metadata = buildMetadata({
  // No title override — uses the default "NUUN Creative Lab — We make things worth finding."
  description:
    "NUUN Creative is a digital studio that builds web experiences worth remembering. Explore the interactive lab, read the manifesto, and see what your website could feel like.",
  path: "/",
});

export default function Home() {
  return (
    <main>
      <HeroScene />
    </main>
  );
}
