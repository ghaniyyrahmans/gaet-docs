import { navigation } from "$lib/data";
import { SITE_URL, LAST_UPDATED } from "$lib/seo";

export const prerender = true;

const groupPriority: Record<string, string> = {
  "Getting started": "0.9",
  "User guide": "0.8",
  Reference: "0.8",
  Development: "0.6",
};

export function GET() {
  const lastmod = LAST_UPDATED;

  const entries = [
    { loc: "/", priority: "1.0" },
    { loc: "/docs", priority: "0.9" },
    { loc: "/about", priority: "0.5" },
    ...navigation.flatMap((group) =>
      group.items.map((item) => ({
        loc: item.href,
        priority: groupPriority[group.label] ?? "0.7",
      })),
    ),
  ];

  const urls = entries
    .map(
      (entry) =>
        `  <url><loc>${SITE_URL}${entry.loc}</loc><lastmod>${lastmod}</lastmod><priority>${entry.priority}</priority></url>`,
    )
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(body, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
