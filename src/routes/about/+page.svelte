<script lang="ts">
  import { SITE_URL, REPO_URL, jsonLdScript, organizationSchema, websiteSchema, LAST_UPDATED, formatUpdated } from '$lib/seo';

  const structuredData = jsonLdScript({
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${SITE_URL}/about#page`,
    name: "About Gaet and this documentation",
    url: `${SITE_URL}/about`,
    description:
      "Who maintains the Gaet PostgreSQL backup CLI, how these docs are verified, and where to report issues.",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
    dateModified: LAST_UPDATED,
    mainEntity: {
      "@type": "SoftwareApplication",
      name: "Gaet",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Linux, macOS, Windows",
      license: "https://opensource.org/licenses/MIT",
      codeRepository: REPO_URL,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  });
</script>

<svelte:head>
  {@html structuredData}
</svelte:head>

<section class="quick-section page-shell about-page">
  <div class="section-heading">
    <h1>About Gaet and this documentation</h1>
    <p class="article-lede">Gaet is an open-source command-line tool for moving PostgreSQL databases between a local instance and a remote one, with a timestamped snapshot kept at every step. This site is its official documentation.</p>
  </div>

  <h2>What Gaet does</h2>
  <p>Gaet wraps the standard PostgreSQL client tools. A push dumps the local database with <code>pg_dump -Fc</code>, validates the archive with <code>pg_restore --list</code>, stores the snapshot under <code>~/.gaet/backups</code>, then resets and restores the configured remote database. A fetch runs the same pipeline in reverse and takes a safety snapshot of the local database before it is overwritten. A restore replays a snapshot that is already on disk.</p>
  <p>It is a snapshot tool, not a replication system. It does not stream changes or provide point-in-time recovery, and it is not a replacement for a managed backup service.</p>

  <h2>Project and license</h2>
  <p>Gaet is developed in the public <a href={REPO_URL}>GitHub repository</a> and released under the <a href="https://github.com/ghaniyyrahmans/gaet/blob/main/LICENSE">MIT license</a>. The runtime is written in Go with no third-party runtime dependencies, and the CLI, backup engine, and dashboard ship as a single binary.</p>

  <h2>How these docs are maintained</h2>
  <p>Documentation is treated as part of the codebase. Claims on this site are checked against the repository rather than written from memory, and the repository ships a verification script that fails when a documented command, environment variable, path, or SDK method does not exist in the source.</p>
  <p>If a page here disagrees with the tool's actual behavior, the page is the bug. Report it and it will be corrected against the implementation.</p>

  <h2>Support and security</h2>
  <p>Questions, bug reports, and documentation fixes go to <a href="https://github.com/ghaniyyrahmans/gaet/issues">GitHub Issues</a>. Security reports should follow the process in <a href="https://github.com/ghaniyyrahmans/gaet/blob/main/SECURITY.md">SECURITY.md</a> instead of a public issue. Contribution guidance, including how to run the test suite, is in <a href="/docs/development/contributing">Contributing</a>.</p>

  <p class="page-updated">Last updated <time datetime={LAST_UPDATED}>{formatUpdated()}</time>.</p>
</section>
