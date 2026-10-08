import type { CollectionEntry } from "astro:content";

export function compareJournalPostsNewestFirst(
  a: CollectionEntry<"journal">,
  b: CollectionEntry<"journal">,
): number {
  // Numbered slugs break ties when posts share the same publication date.
  return (
    b.data.date.valueOf() - a.data.date.valueOf() ||
    b.id.localeCompare(a.id, "en", { numeric: true })
  );
}
