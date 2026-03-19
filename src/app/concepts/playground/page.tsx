import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ConceptPage } from "@/components/site/ConceptPage";
import { CONCEPTS } from "@/data/concepts";

const concept = CONCEPTS.find((c) => c.slug === "playground")!;
const index   = CONCEPTS.findIndex((c) => c.slug === "playground");

export const metadata: Metadata = buildMetadata({
  title: concept.title,
  description: concept.description,
  path: `/concepts/${concept.slug}`,
});

export default function PlaygroundPage() {
  return <ConceptPage concept={concept} index={index} />;
}
