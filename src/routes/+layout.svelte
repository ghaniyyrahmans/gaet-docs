<script lang="ts">
  import '../app.css';
  import { navigation } from '$lib/data';
  import { page } from '$app/state';
  import { onMount, tick } from 'svelte';
  import { searchItems } from '$lib/data';

  let { children } = $props();

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
  <meta name="theme-color" content="#f7fafb" />
  <link rel="canonical" href={`${page.url.origin}${page.url.pathname}`} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Gaet Documentation" />
  <meta property="og:description" content="The official documentation for Gaet, a PostgreSQL backup and restore toolkit." />
  <meta property="og:url" content={`${page.url.origin}${page.url.pathname}`} />
  <meta property="og:site_name" content="Gaet Documentation" />
  <meta property="og:image" content={`${page.url.origin}/logo/gaet-lfw.svg`} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Gaet Documentation" />
  <meta name="twitter:description" content="The official documentation for Gaet, a PostgreSQL backup and restore toolkit." />
  <meta name="twitter:image" content={`${page.url.origin}/logo/gaet-lfw.svg`} />
  <meta name="robots" content="index, follow" />
</svelte:head>

<a class="skip-link" href="#main-content">Skip to content</a>
<header class="site-header">
  <div class="header-inner">
    <a class="brand" href="/" aria-label="Gaet home"><img class="brand-logo" width="27" height="27" src="/logo/gaet-lft.svg" alt="" /><span>gaet</span></a>
    <nav class="top-nav" aria-label="Primary navigation">
      <a class:active={page.url.pathname.startsWith('/docs')} href="/docs/getting-started/quickstart">Documentation</a>
      <a href="/docs/reference/cli">CLI reference</a>
      <a href="/docs/reference/rest-api">API</a>
      <a href="https://github.com/ghaniyyrahmans/gaet/releases/latest" target="_blank" rel="noreferrer">Download ↗</a>
    </nav>
    <div class="header-actions">
      <button bind:this={searchTrigger} class="search-trigger" type="button" onclick={openSearch} aria-label="Search documentation"><span>Search docs</span><kbd>⌘ K</kbd></button>
      <button class="theme-trigger" type="button" onclick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>{theme === 'light' ? 'Dark' : 'Light'}</button>
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
    <div class="mobile-group"><a href="https://github.com/ghaniyyrahmans/gaet/releases/latest" target="_blank" rel="noreferrer" onclick={closeMenu}>Download latest ↗</a></div>
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

<footer class="site-footer"><div><a class="brand" href="/"><img class="brand-logo" width="27" height="27" src="/logo/gaet-lft.svg" alt="" /><span>gaet</span></a><p>PostgreSQL backup and restore, documented.</p></div><div class="footer-links"><a href="/docs/getting-started/quickstart">Get started</a><a href="/docs/reference/cli">CLI reference</a><a href="https://github.com/ghaniyyrahmans/gaet">GitHub ↗</a></div><small>© 2026 Gaet documentation</small></footer>
