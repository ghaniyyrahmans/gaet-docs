<script lang="ts">
  import { navigation } from '$lib/data';
  import {
    SITE_URL,
    metaFor,
    absoluteUrl,
    jsonLdScript,
    organizationSchema,
    websiteSchema,
    organizationId,
    websiteId,
  } from '$lib/seo';

  const groups = navigation.map((group) => ({
    ...group,
    slug: group.label.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    items: group.items.map((item) => ({
      ...item,
      description: metaFor(item.href).description,
    })),
  }));

  const structuredData = jsonLdScript({
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema(),
      websiteSchema(),
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/docs#page`,
        name: "Gaet documentation",
        url: `${SITE_URL}/docs`,
        description: metaFor('/docs').description,
        inLanguage: "en",
        isPartOf: { "@id": websiteId },
        publisher: { "@id": organizationId },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: navigation
            .flatMap((group) => group.items)
            .map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: item.title,
              url: absoluteUrl(item.href),
            })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Documentation", item: `${SITE_URL}/docs` },
        ],
      },
    ],
  });
</script>

<svelte:head>
  {@html structuredData}
</svelte:head>

<div class="docs-layout page-shell">
  <aside class="docs-sidebar" aria-label="Documentation navigation">
    {#each navigation as group}
      <div class="sidebar-group"><p>{group.label}</p>{#each group.items as item}<a href={item.href}>{item.title}</a>{/each}</div>
    {/each}
  </aside>
  <article class="article">
    <div class="breadcrumbs"><a href="/">Home</a><span>/</span><span>Documentation</span></div>
    <h1>Gaet documentation</h1>
    <p class="article-lede">
      Every Gaet guide in one place: install the CLI, connect PostgreSQL, move data between local and remote
      databases, restore snapshots, and automate backups.
    </p>
    {#each groups as group}
      <h2 id={group.slug}>{group.label}</h2>
      <ul class="doc-hub">
        {#each group.items as item}
          <li>
            <a href={item.href}>
              <strong>{item.title}</strong>
              <span>{item.description}</span>
            </a>
          </li>
        {/each}
      </ul>
    {/each}
  </article>
  <aside class="on-this-page">
    <p>On this page</p>
    {#each groups as group}
      <a href={`#${group.slug}`}>{group.label}</a>
    {/each}
  </aside>
</div>
