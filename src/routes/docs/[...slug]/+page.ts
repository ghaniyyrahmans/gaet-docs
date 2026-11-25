import { error } from "@sveltejs/kit";
import { navigation } from "$lib/data";
import { normalizePath } from "$lib/seo";

const docsRoutes = new Set(
  navigation.flatMap((group) => group.items.map((item) => item.href)),
);

export function load({ url }: { url: URL }) {
  if (!docsRoutes.has(normalizePath(url.pathname))) {
    error(404, "This documentation page does not exist.");
  }

  return {};
}
