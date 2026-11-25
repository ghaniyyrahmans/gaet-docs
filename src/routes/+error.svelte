<script lang="ts">
  import { page } from '$app/state';

  const notFound = $derived(page.status === 404);
</script>

<div class="page-shell" style="max-width: 720px; padding-top: 96px; padding-bottom: 120px">
  <p class="overline">{page.status}</p>
  <h1 style="font-size: 46px; letter-spacing: -0.06em; line-height: 1.05; margin: 10px 0 16px">
    {notFound ? 'This page is not in the docs.' : 'Something went wrong.'}
  </h1>
  <p class="article-lede">
    {notFound
      ? 'The URL may be outdated, or the page may have moved. Start from the documentation index to find the guide you need.'
      : 'The page could not be rendered. Try again, or open the documentation index.'}
  </p>
  <div class="hero-actions">
    <a class="button button-primary" href="/docs">Browse documentation <span>→</span></a>
    <a class="button button-ghost" href="/">Back home <span>↗</span></a>
  </div>
</div>
