<script lang="ts">
  import { commands, navigation, quickLinks } from '$lib/data';
  import {
    SITE_URL,
    REPO_URL,
    jsonLdScript,
    organizationSchema,
    websiteSchema,
    authorSchema,
    authorId,
  } from '$lib/seo';

  const structuredData = jsonLdScript({
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema(),
      websiteSchema(),
      authorSchema(),
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}/#software`,
        name: "Gaet",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Linux, macOS, Windows",
        description:
          "A command-line toolkit that pushes and fetches PostgreSQL databases, validates every dump, and keeps timestamped local snapshots.",
        url: `${SITE_URL}/`,
        downloadUrl: `${REPO_URL}/releases/latest`,
        codeRepository: REPO_URL,
        license: "https://opensource.org/licenses/MIT",
        softwareHelp: `${SITE_URL}/docs`,
        author: { "@id": authorId },
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        sameAs: [REPO_URL],
      },
    ],
  });
</script>

<svelte:head>
  {@html structuredData}
</svelte:head>

<section class="hero-band">
  <div class="home-hero page-shell">
    <div class="hero-copy">
      <p class="hero-badge"><span class="live-dot"></span> Official documentation</p>
      <h1>PostgreSQL backups you can <em>find your way back to.</em></h1>
      <p class="hero-lede">Gaet is a PostgreSQL backup and restore toolkit. This is the reference for setting it up, operating it, and understanding what happens under the hood.</p>
      <div class="hero-actions">
        <a class="button button-primary" href="/docs/getting-started/quickstart">Start with the quickstart <span>→</span></a>
        <a class="button button-ghost" href="/docs/reference/cli">Browse CLI reference <span>↗</span></a>
      </div>
    </div>
    <div class="hero-card">
      <div class="hero-card-head">
        <img class="hero-logo" width="72" height="72" fetchpriority="high" src="/logo/gaet-lft.svg" alt="Gaet logo" />
        <div class="hero-card-title">
          <strong>gaet</strong>
          <span>PostgreSQL backup and restore</span>
        </div>
      </div>
      <div class="hero-steps">
        <a class="hero-step" href="/docs/reference/cli#init"><code>gaet init</code><span>Connect a database</span></a>
        <a class="hero-step" href="/docs/reference/cli#push"><code>gaet push</code><span>Snapshot to a remote</span></a>
        <a class="hero-step" href="/docs/reference/cli#status"><code>gaet status</code><span>Compare both sides</span></a>
      </div>
      <div class="hero-card-foot"><span>CLI</span><span>Dashboard</span><span>SDK</span><a class="hero-download" href="/docs/getting-started/installation">Download latest <span aria-hidden="true">↗</span></a></div>
    </div>
  </div>
</section>

<section class="quick-section page-shell"><div class="section-heading"><p class="overline">The shortest path</p><h2>Start where you are.</h2><p>Three common entry points for working with Gaet.</p></div><div class="quick-grid">{#each quickLinks as link}<a class="quick-card" href={link.href}><span class="card-number">{link.number}</span><div><p class="card-eyebrow">{link.eyebrow}</p><h3>{link.title}</h3><p>{link.description}</p></div><span class="card-arrow">↗</span></a>{/each}</div></section>

<section class="map-section page-shell"><div class="section-heading"><p class="overline">Documentation map</p><h2>Everything in its place.</h2></div><div class="map-grid">{#each navigation as group}<div class="map-group"><p class="map-label">{group.label}</p>{#each group.items as item}<a href={item.href}>{item.title}<span>↗</span></a>{/each}</div>{/each}</div></section>

<section class="command-strip page-shell"><div><p class="overline">Command reference</p><h2>One CLI. A clear path through every operation.</h2><a class="text-link" href="/docs/reference/cli">Read every command and flag <span>→</span></a></div><div class="command-list">{#each commands as command}<a href={command.href}><code>gaet {command.name}</code><span>{command.description}</span></a>{/each}</div></section>
