import type { APIRoute } from "astro";
import { listFieldNotes } from "@/lib/field-notes";
import { listAllIssues } from "@/lib/issues";
import { ensureValidated } from "@/lib/validate";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function rfc822(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toUTCString();
}

export const GET: APIRoute = ({ site }) => {
  ensureValidated();

  if (!site) {
    throw new Error("Astro `site` must be set for feed generation. See astro.config.mjs.");
  }

  const origin = site.toString().replace(/\/$/, "");
  const fieldNoteItems = listFieldNotes().map((note) => ({
    title: note.title,
    href: `/field-notes/${note.slug}`,
    description: note.summary,
    date: note.date,
  }));
  const issueItems = listAllIssues()
    .filter((issue) => issue.meta?.releaseDate)
    .map((issue) => ({
      title: issue.meta?.title ? `${issue.label}: ${issue.meta.title}` : issue.label,
      href: issue.href,
      description: issue.meta?.summary ?? `Release notes for ${issue.label}.`,
      date: issue.meta!.releaseDate!,
    }));
  const items = [...fieldNoteItems, ...issueItems]
    .filter((item) => item.date)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 30);
  const latestDate = items[0]?.date ?? new Date().toISOString().slice(0, 10);
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n` +
    `  <channel>\n` +
    `    <title>The Hard Parts</title>\n` +
    `    <link>${origin}/</link>\n` +
    `    <description>An engineering reference for recurring software failures, warning signals, hard decisions, and practical playbooks.</description>\n` +
    `    <language>en</language>\n` +
    `    <lastBuildDate>${rfc822(latestDate)}</lastBuildDate>\n` +
    `    <atom:link href="${origin}/feed.xml" rel="self" type="application/rss+xml" />\n` +
    items
      .map((item) => {
        const url = `${origin}${item.href}`;
        return (
          `    <item>\n` +
          `      <title>${escapeXml(item.title)}</title>\n` +
          `      <link>${url}</link>\n` +
          `      <guid isPermaLink="true">${url}</guid>\n` +
          `      <pubDate>${rfc822(item.date)}</pubDate>\n` +
          `      <description>${escapeXml(item.description)}</description>\n` +
          `    </item>`
        );
      })
      .join("\n") +
    `\n  </channel>\n` +
    `</rss>\n`;

  return new Response(body, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
};
