<script lang="ts">
  import '../app.css';
  import { navigation } from '$lib/data';
  import { page } from '$app/state';
  import { metaFor, absoluteUrl, OG_IMAGE_PATH, SITE_NAME, SITE_URL, LAST_UPDATED, AUTHOR_NAME } from '$lib/seo';
  import { onMount, tick } from 'svelte';
  import { searchItems } from '$lib/data';

  let { children } = $props();

  const indexable = $derived(page.status < 400);
  const meta = $derived(
    indexable
      ? metaFor(page.url.pathname)
      : {
          title: "Page not found | Gaet",
          description: "This page is not part of the Gaet documentation.",
        },
  );
  const canonicalUrl = $derived(absoluteUrl(page.url.pathname));
  const ogImage = `${SITE_URL}${OG_IMAGE_PATH}`;
  const isArticle = $derived(page.url.pathname.startsWith("/docs/"));

  let menuOpen = $state(false);
  let searchOpen = $state(false);
  let theme = $state<'light' | 'dark'>('light');
  let searchQuery = $state('');
  let searchInput = $state<HTMLInputElement>();
  let searchTrigger = $state<HTMLButtonElement>();
  let menuTrigger = $state<HTMLButtonElement>();
  const searchResults = $derived(searchItems.filter((item) => `${item.title} ${item.description}`.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 8));

  onMount(() => {
    theme = (localStorage.getItem('gaet-theme') as 'light' | 'dark') ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.dataset.theme = theme;
  });

  async function openSearch() { searchOpen = true; await tick(); searchInput?.focus(); }
  function closeSearch() { searchOpen = false; searchQuery = ''; searchTrigger?.focus(); }
  function toggleTheme() { theme = theme === 'light' ? 'dark' : 'light'; document.documentElement.dataset.theme = theme; localStorage.setItem('gaet-theme', theme); }
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      if (searchOpen) closeSearch();
      else if (menuOpen) { menuOpen = false; menuTrigger?.focus(); }
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); openSearch(); }
  }

  function closeMenu() { menuOpen = false; }
</script>

<svelte:head>
  <meta name="theme-color" content="#f7fafb" media="(prefers-color-scheme: light)" />
  <meta name="theme-color" content="#0d2029" media="(prefers-color-scheme: dark)" />
  <title>{meta.title}</title>
  <meta name="description" content={meta.description} />
  {#if indexable}
    <link rel="canonical" href={canonicalUrl} />
    <meta name="robots" content="index, follow, max-image-preview:large" />
  {:else}
    <meta name="robots" content="noindex, nofollow" />
  {/if}
  <meta property="og:type" content={isArticle ? "article" : "website"} />
  {#if isArticle}<meta property="article:modified_time" content={LAST_UPDATED} />{/if}
  <meta property="og:site_name" content={SITE_NAME} />
  <meta property="og:locale" content="en_US" />
  <meta property="og:title" content={meta.title} />
  <meta property="og:description" content={meta.description} />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:image" content={ogImage} />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Gaet: PostgreSQL backup and restore documentation" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={meta.title} />
  <meta name="twitter:description" content={meta.description} />
  <meta name="twitter:image" content={ogImage} />
  <meta name="twitter:image:alt" content="Gaet: PostgreSQL backup and restore documentation" />
</svelte:head>

<a class="skip-link" href="#main-content">Skip to content</a>
<header class="site-header">
  <div class="header-inner">
    <a class="brand" href="/" aria-label="Gaet home"><img class="brand-logo" width="27" height="27" src="/logo/gaet-lft.svg" alt="" /><span>gaet</span></a>
    <nav class="top-nav" aria-label="Primary navigation">
      <a class:active={page.url.pathname.startsWith('/docs')} href="/docs">Documentation</a>
      <a href="/docs/reference/cli">CLI reference</a>
      <a href="/docs/reference/rest-api">API</a>
      <a href="/docs/getting-started/installation">Download ↗</a>
    </nav>
    <div class="header-actions">
      <button bind:this={searchTrigger} class="search-trigger" type="button" onclick={openSearch}><span>Search docs</span><kbd>⌘ K</kbd></button>
      <button class="theme-trigger" type="button" onclick={toggleTheme}>{theme === 'light' ? 'Dark mode' : 'Light mode'}</button>
      <a class="github-link" href="https://github.com/ghaniyyrahmans/gaet" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
      <button bind:this={menuTrigger} class="menu-trigger" type="button" onclick={() => (menuOpen = !menuOpen)} aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label="Menu">Menu</button>
    </div>
  </div>
</header>

{#if menuOpen}
  <div id="mobile-navigation" class="mobile-menu" role="dialog" aria-label="Mobile navigation">
    <div class="mobile-menu-top"><strong>Navigate</strong><button type="button" onclick={closeMenu} aria-label="Close menu">Close</button></div>
    {#each navigation as group}
      <div class="mobile-group"><p>{group.label}</p>{#each group.items as item}<a href={item.href} onclick={closeMenu}>{item.title}</a>{/each}</div>
    {/each}
    <div class="mobile-group"><a href="/docs/getting-started/installation" onclick={closeMenu}>Download latest ↗</a></div>
  </div>
{/if}

{#if searchOpen}
  <div class="search-overlay" role="presentation" onclick={(e) => e.target === e.currentTarget && (searchOpen = false)}>
    <div class="search-dialog" role="dialog" aria-modal="true" aria-label="Search documentation">
      <div class="search-box"><span aria-hidden="true">⌕</span><input bind:this={searchInput} bind:value={searchQuery} aria-label="Search documentation" placeholder="Search documentation..." /><button type="button" onclick={closeSearch}>Esc</button></div>
      {#if searchQuery}<div class="search-results" aria-live="polite">{#if searchResults.length}{#each searchResults as result}<a href={result.href} onclick={closeSearch}><strong>{result.title}</strong><small>{result.group} · {result.description}</small></a>{/each}{:else}<p>No matching documentation.</p>{/if}</div>{:else}<p class="search-hint">Search commands, guides, and environment variables.</p>{/if}
    </div>
  </div>
{/if}

<main id="main-content">{@render children()}</main>

<svelte:window onkeydown={handleKeydown} />

<footer class="site-footer"><div><a class="brand" href="/"><img class="brand-logo" width="27" height="27" src="/logo/gaet-lft.svg" alt="" /><span>gaet</span></a><p>PostgreSQL backup and restore, documented.</p></div><div class="footer-links"><a href="/docs/getting-started/quickstart">Create your first backup</a><a href="/docs/reference/cli">CLI reference</a><a href="/about">About</a><a href="https://github.com/ghaniyyrahmans/gaet">GitHub ↗</a></div><small>Docs by <a href="/about">{AUTHOR_NAME}</a> · © 2026</small></footer>
