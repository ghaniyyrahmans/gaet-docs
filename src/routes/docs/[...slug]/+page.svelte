<script lang="ts">
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import { navigation } from '$lib/data';
  import {
    SITE_URL,
    OG_IMAGE_PATH,
    metaFor,
    absoluteUrl,
    jsonLdScript,
    organizationId,
    websiteId,
    organizationSchema,
    websiteSchema,
    LAST_UPDATED,
    formatUpdated,
  } from '$lib/seo';
  const path = $derived(page.url.pathname);
  const isWhatIs = $derived(path.includes('what-is-gaet'));
  const isInstallation = $derived(path.includes('installation'));
  const isQuickstart = $derived(path.includes('quickstart'));
  const isConfiguration = $derived(path.includes('/configuration'));
  const isPush = $derived(path.includes('push-backups'));
  const isFetch = $derived(path.includes('/fetch'));
  const isAutomatic = $derived(path.includes('automatic-backups'));
  const isEnvironment = $derived(path.includes('environment'));
  const isApi = $derived(path.includes('rest-api'));
  const isArchitecture = $derived(path.includes('architecture'));
  const isTroubleshooting = $derived(path.includes('troubleshooting'));
  const isSdk = $derived(path.includes('/sdk'));
  const isUtilities = $derived(path.includes('utilities'));
  const isResponses = $derived(path.includes('responses'));
  const isSecurity = $derived(path.includes('security'));
  const isCiCd = $derived(path.includes('ci-cd'));
  const isLifecycle = $derived(path.includes('lifecycle'));
  const isContributing = $derived(path.includes('contributing'));
  const isRestore = $derived(path.includes('restore'));
  const isCli = $derived(path.includes('/cli'));
  let copyReset: ReturnType<typeof setTimeout>;
  let detectedPlatform = $state('platform Anda');
  let quickInstallCommand = $state('');

  onMount(() => {
    const ua = navigator.userAgent;
    let platform = 'platform Anda';
    let cmd = '';

    if (/win32|win64|windows|win32/i.test(ua)) {
      platform = 'Windows';
      cmd = "irm https://raw.githubusercontent.com/ghaniyyrahmans/gaet/lts/v1.1/install.ps1 | iex";
    } else if (/macintosh|mac os x/i.test(ua)) {
      if (/arm64|apple silicon/i.test(ua) || navigator.platform?.includes('arm')) {
        platform = 'macOS Apple Silicon';
      } else {
        platform = 'macOS Intel';
      }
      cmd = "curl -sSL https://raw.githubusercontent.com/ghaniyyrahmans/gaet/lts/v1.1/install.sh | bash";
    } else if (/linux|x11/i.test(ua)) {
      platform = 'Linux';
      cmd = "curl -sSL https://raw.githubusercontent.com/ghaniyyrahmans/gaet/lts/v1.1/install.sh | bash";
    }

    detectedPlatform = platform;
    quickInstallCommand = cmd;
  });

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.top = '-1000px';
      document.body.append(area);
      area.select();
      const copied = document.execCommand('copy');
      area.remove();
      return copied;
    }
  }

  async function copyCode(event: MouseEvent) {
    const button = event.currentTarget as HTMLButtonElement;
    const code = button.parentElement?.querySelector('code')?.innerText ?? '';
    const copied = await copyText(code);
    button.textContent = copied ? 'Copied!' : 'Copy failed';
    clearTimeout(copyReset);
    copyReset = setTimeout(() => {
      if (button.isConnected) button.textContent = 'Copy';
    }, 1800);
  }

  function addCopyButtons(node: HTMLElement) {
    const scan = () =>
      node.querySelectorAll('pre').forEach((block) => {
        let shell = block.parentElement;
        if (!shell || !shell.classList.contains('code-shell')) {
          shell = document.createElement('div');
          shell.className = 'code-shell';
          block.before(shell);
          shell.append(block);
        }
        if (!shell.querySelector('.copy-code')) {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'copy-code';
          button.textContent = 'Copy';
          button.setAttribute('aria-label', 'Copy code to clipboard');
          button.addEventListener('click', copyCode);
          shell.append(button);
        }
      });
    scan();
    const observer = new MutationObserver(scan);
    observer.observe(node, { childList: true, subtree: true });
    return { destroy() { observer.disconnect(); clearTimeout(copyReset); node.querySelectorAll('.copy-code').forEach((button) => button.removeEventListener('click', copyCode)); } };
  }
  const title = $derived(isWhatIs ? 'What is Gaet?' : isInstallation ? 'Installation' : isQuickstart ? 'Quickstart' : isConfiguration ? 'Configuration' : isPush ? 'Push a backup' : isFetch ? 'Fetch from a remote' : isRestore ? 'Restore a snapshot' : isAutomatic ? 'Automatic backups' : isTroubleshooting ? 'Troubleshooting' : isUtilities ? 'CLI utilities' : isCli ? 'CLI reference' : isEnvironment ? 'Environment variables' : isApi ? 'REST API' : isSdk ? 'TypeScript SDK' : isResponses ? 'REST API responses' : isSecurity ? 'Security and safety' : isCiCd ? 'CI/CD integration' : isLifecycle ? 'Updating and uninstalling' : isContributing ? 'Contributing' : isArchitecture ? 'Architecture' : path.split('/').pop()?.replaceAll('-', ' ') ?? 'Documentation');
  const canonicalUrl = $derived(absoluteUrl(path));
  const pageInfo = $derived(metaFor(path));
  const structuredData = $derived(
    jsonLdScript({
      "@context": "https://schema.org",
      "@graph": [
        organizationSchema(),
        websiteSchema(),
        {
          "@type": "TechArticle",
          "@id": `${canonicalUrl}#article`,
          headline: pageInfo.h1 ?? title,
          description: pageInfo.description,
          url: canonicalUrl,
          mainEntityOfPage: canonicalUrl,
          image: `${SITE_URL}${OG_IMAGE_PATH}`,
          inLanguage: "en",
          isPartOf: { "@id": websiteId },
          author: { "@id": organizationId },
          publisher: { "@id": organizationId },
          dateModified: LAST_UPDATED,
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "Documentation", item: `${SITE_URL}/docs` },
            { "@type": "ListItem", position: 3, name: title, item: canonicalUrl },
          ],
        },
      ],
    }),
  );
</script>

<svelte:head>
  {@html structuredData}
</svelte:head>
<div class="docs-layout page-shell" class:no-aside={!isInstallation}>
  <aside class="docs-sidebar" aria-label="Documentation navigation">{#each navigation as group}<div class="sidebar-group"><p>{group.label}</p>{#each group.items as item}<a class:current={path === item.href} href={item.href}>{item.title}</a>{/each}</div>{/each}</aside>
  <article class="article" use:addCopyButtons><div class="breadcrumbs"><a href="/">Home</a><span>/</span><a href="/docs">Documentation</a><span>/</span><span>{title}</span></div><h1>{pageInfo.h1 ?? title}</h1>
    {#if isWhatIs}
      <p class="article-lede">Gaet is a Go command-line tool that moves PostgreSQL data between a local database and a remote PostgreSQL database, and keeps a local snapshot of every step.</p>
      <h2>What a push does</h2>
      <p>Gaet dumps the local database with <code>pg_dump -Fc</code>, validates the archive with <code>pg_restore --list</code>, writes the snapshot to the backup directory, then resets and restores the remote database from that archive.</p>
      <p>A fetch runs the same pipeline in reverse: dump the remote database, save a safety snapshot locally, reset the local target, and restore the remote dump into it. A restore replays a snapshot that is already on disk.</p>
      <h2>What Gaet manages</h2>
      <div class="reference-table"><div><strong>Location</strong><strong>Contents</strong></div><div><code>~/.gaet/.env</code><span>Configuration, written with <code>0600</code> permissions</span></div><div><code>~/.gaet/backups</code><span><code>.dump</code> snapshots, lock file, and logs</span></div><div><code>gaet.log</code> and <code>cron.log</code><span>Operation history read by <code>gaet log</code></span></div><div><code>~/.local/bin</code><span>User-local launcher installed by the install script</span></div></div>
      <h2>Command surface</h2>
      <div class="reference-table"><div><strong>Area</strong><strong>Commands</strong></div><div><span>Setup</span><code>init</code></div><div><span>Data movement</span><code>push</code>, <code>fetch</code>, <code>restore</code></div><div><span>Snapshots</span><code>snapshots</code></div><div><span>Diagnostics</span><code>status</code>, <code>check</code>, <code>doctor</code>, <code>diff</code>, <code>log</code></div><div><span>Configuration</span><code>remote</code>, <code>get</code>, <code>set</code>, <code>export</code></div><div><span>Scheduling</span><code>auto</code>, <code>stop</code></div><div><span>Interfaces</span><code>serve</code>, <code>completion</code></div><div><span>Maintenance</span><code>update</code>, <code>uninstall</code></div></div>
      <h2>Requirements</h2>
      <p>Gaet shells out to the PostgreSQL client tools. <code>pg_dump</code>, <code>pg_restore</code>, and <code>psql</code> must be installed on the machine that runs Gaet, and the machine needs network access to the remote database.</p>
      <h2>Scope</h2>
      <p>Gaet is a snapshot tool, not a replication system. It does not stream changes, provide point-in-time recovery, or replace a managed backup service. The dashboard has no built-in authentication, so keep it on a trusted interface.</p>
    {:else if isInstallation}
      <p class="article-lede">Download Gaet, confirm the PostgreSQL client tools, then initialize your workspace.</p>

      <section class="install-hero">
        <div class="install-badge">Recommended for {detectedPlatform}</div>
        <h2 id="quick-install">Quick install</h2>
        <p>Choose one of the following methods for your operating system:</p>
        <div class="install-command">
          <pre><code>{quickInstallCommand}</code></pre>
        </div>
        <p class="install-hero-note">Run the command in your terminal, then continue to <a href="/docs/getting-started/quickstart">Quickstart</a>.</p>
      </section>

      <section class="install-section">
        <h2 id="before-you-start">Before you start</h2>
        <p>Gaet requires PostgreSQL client tools to run backups and restores. Make sure the following are installed on the machine running Gaet:</p>
        <div class="install-checklist">
          <h3>Required tools</h3>
          <div class="check-item">
            <div class="check-box">☐</div>
            <div class="check-content"><code>pg_dump</code><p>Creates a local database backup archive.</p></div>
          </div>
          <div class="check-item">
            <div class="check-box">☐</div>
            <div class="check-content"><code>pg_restore</code><p>Validates the backup archive before publishing.</p></div>
          </div>
          <div class="check-item">
            <div class="check-box">☐</div>
            <div class="check-content"><code>psql</code><p>PostgreSQL command-line client for connections.</p></div>
          </div>
        </div>
        <p>Verify everything is available by running:</p>
        <pre><code>pg_dump --version
pg_restore --version
psql --version</code></pre>
      </section>

      <section class="install-section">
        <h2 id="downloads-by-platform">Downloads by platform</h2>
        <p>Standalone archives and installers are published on the <a href="https://github.com/ghaniyyrahmans/gaet/releases/latest" target="_blank" rel="noreferrer">latest release page ↗</a>. Links below marked "latest" always resolve to the newest release. Package filenames include the version number, so those rows open the release page instead of a fixed URL.</p>

        <div class="download-group">
          <div class="download-group-title"><span class="download-group-os">Windows</span></div>
          <div class="download-options">
            <div class="download-option">
              <span class="download-option-type">exe</span>
              <code class="download-option-asset">gaet-windows-amd64.exe</code>
              <a href="https://github.com/ghaniyyrahmans/gaet/releases/latest/download/gaet-windows-amd64.exe" target="_blank" rel="noreferrer" class="download-option-link">Download ↗</a>
            </div>
            <div class="download-option">
              <span class="download-option-type">msi</span>
              <code class="download-option-asset">gaet-windows-amd64.msi</code>
              <a href="https://github.com/ghaniyyrahmans/gaet/releases/latest/download/gaet-windows-amd64.msi" target="_blank" rel="noreferrer" class="download-option-link">Download ↗</a>
            </div>
          </div>
        </div>

        <div class="download-group">
          <div class="download-group-title"><span class="download-group-os">macOS</span></div>
          <div class="download-options">
            <div class="download-option">
              <span class="download-option-type">Intel</span>
              <code class="download-option-asset">gaet-darwin-amd64.tar.gz</code>
              <a href="https://github.com/ghaniyyrahmans/gaet/releases/latest/download/gaet-darwin-amd64.tar.gz" target="_blank" rel="noreferrer" class="download-option-link">Download ↗</a>
            </div>
            <div class="download-option">
              <span class="download-option-type">Apple Silicon</span>
              <code class="download-option-asset">gaet-darwin-arm64.tar.gz</code>
              <a href="https://github.com/ghaniyyrahmans/gaet/releases/latest/download/gaet-darwin-arm64.tar.gz" target="_blank" rel="noreferrer" class="download-option-link">Download ↗</a>
            </div>
            <div class="download-option">
              <span class="download-option-type">.pkg</span>
              <code class="download-option-asset">gaet-&lt;version&gt;-darwin-&#123;amd64,arm64&#125;.pkg</code>
              <a href="https://github.com/ghaniyyrahmans/gaet/releases/latest" target="_blank" rel="noreferrer" class="download-option-link">Release page ↗</a>
            </div>
          </div>
        </div>

        <div class="download-group">
          <div class="download-group-title"><span class="download-group-os">Linux</span></div>
          <div class="download-options">
            <div class="download-option">
              <span class="download-option-type">amd64</span>
              <code class="download-option-asset">gaet-linux-amd64.tar.gz</code>
              <a href="https://github.com/ghaniyyrahmans/gaet/releases/latest/download/gaet-linux-amd64.tar.gz" target="_blank" rel="noreferrer" class="download-option-link">Download ↗</a>
            </div>
            <div class="download-option">
              <span class="download-option-type">arm64</span>
              <code class="download-option-asset">gaet-linux-arm64.tar.gz</code>
              <a href="https://github.com/ghaniyyrahmans/gaet/releases/latest/download/gaet-linux-arm64.tar.gz" target="_blank" rel="noreferrer" class="download-option-link">Download ↗</a>
            </div>
            <div class="download-option">
              <span class="download-option-type">deb · rpm · apk</span>
              <code class="download-option-asset">gaet_&lt;version&gt;_amd64.deb and friends</code>
              <a href="https://github.com/ghaniyyrahmans/gaet/releases/latest" target="_blank" rel="noreferrer" class="download-option-link">Release page ↗</a>
            </div>
            <div class="download-option">
              <span class="download-option-type">Arch Linux</span>
              <code class="download-option-asset">gaet-&lt;version&gt;-1-x86_64.pkg.tar.zst</code>
              <a href="https://github.com/ghaniyyrahmans/gaet/releases/latest" target="_blank" rel="noreferrer" class="download-option-link">Release page ↗</a>
            </div>
          </div>
        </div>

        <p>The Debian, RPM, Alpine, and Arch packages are attached to each versioned release with the version in the filename. Windows arm64 builds are not published; use the amd64 binary or build from source.</p>
        <div class="callout info"><strong>Verify checksum</strong><p>Check the downloaded file against <a href="https://github.com/ghaniyyrahmans/gaet/releases/latest/download/checksums.txt" target="_blank" rel="noreferrer">checksums.txt ↗</a> before installing it.</p></div>
      </section>

      <section class="install-section">
        <h2 id="install-script">Install script</h2>
        <div class="install-method">
          <h3>Linux and macOS</h3>
          <pre><code>curl -sSL https://raw.githubusercontent.com/ghaniyyrahmans/gaet/lts/v1.1/install.sh | bash</code></pre>
        </div>
        <div class="install-method">
          <h3>Windows PowerShell</h3>
          <pre><code>irm https://raw.githubusercontent.com/ghaniyyrahmans/gaet/lts/v1.1/install.ps1 | iex</code></pre>
        </div>
      </section>

      <section class="install-section">
        <h2 id="build-from-source">Build from source</h2>
        <p>With Go toolchain:</p>
        <pre><code>go install github.com/ghaniyyrahmans/gaet/cmd/gaet@latest</code></pre>
        <p>Or clone the repository and build a stripped binary:</p>
        <pre><code>git clone https://github.com/ghaniyyrahmans/gaet.git
cd gaet
go build -ldflags="-s -w" -o ~/.local/bin/gaet ./cmd/gaet</code></pre>
      </section>

      <section class="install-section">
        <h2 id="verify-installation">Verify installation</h2>
        <p>Make sure the binary is available and working properly:</p>
        <div class="install-checklist">
          <div class="check-item">
            <div class="check-box">☐</div>
            <div class="check-content"><code>gaet --version</code><p>Shows installed Gaet version.</p></div>
          </div>
          <div class="check-item">
            <div class="check-box">☐</div>
            <div class="check-content"><code>gaet doctor</code><p>Diagnoses local settings and connection.</p></div>
          </div>
        </div>
      </section>

      <section class="install-section">
        <h2 id="initialize-workspace">Initialize workspace</h2>
        <pre><code>gaet init</code></pre>
        <p>Initialization writes <code>~/.gaet/.env</code> and prepares the backup directory. Run <code>gaet doctor</code> to verify the result.</p>
      </section>

      <section class="install-next">
        <h3>Next step</h3>
        <p>Gaet is installed. Create your first PostgreSQL backup:</p>
        <a href="/docs/getting-started/quickstart">Open Quickstart →</a>
      </section>
    {:else if isQuickstart}
      <p class="article-lede">Install Gaet, connect it to a local PostgreSQL database, and create your first snapshot in a few minutes.</p>

      <h2>Before you begin</h2>
      <p>You need a running PostgreSQL instance you can reach with <code>psql</code>, and a second PostgreSQL database to act as the remote target. The remote can be a managed service such as Supabase, Neon, or RDS, or another local instance while you test.</p>
      <p>Gaet does not embed a database driver. It calls <code>pg_dump</code>, <code>pg_restore</code>, and <code>psql</code>, so install client tools that match your server's major version and make sure they are on <code>PATH</code>:</p>
      <pre><code>pg_dump --version
pg_restore --version
psql --version</code></pre>
      <div class="callout"><strong>Source of truth</strong><p>These docs describe the Go engine on the <code>lts/v1.1</code> branch. When behavior and a page disagree, verify with <code>gaet doctor</code> and <code>gaet status</code>, then report the page.</p></div>

      <h2>Step 1: Install Gaet</h2>
      <p>The install script places the binary in a user-local directory and adds a launcher:</p>
      <pre><code>curl -sSL https://raw.githubusercontent.com/ghaniyyrahmans/gaet/lts/v1.1/install.sh | bash</code></pre>
      <p>On Windows PowerShell, use the matching script:</p>
      <pre><code>irm https://raw.githubusercontent.com/ghaniyyrahmans/gaet/lts/v1.1/install.ps1 | iex</code></pre>
      <p>Confirm the binary is available before continuing:</p>
      <pre><code>gaet --version</code></pre>
      <p>Prefer a package or a manual archive? Use the <a href="/docs/getting-started/installation">installation page</a>.</p>

      <h2>Step 2: Initialize a workspace</h2>
      <pre><code>gaet init</code></pre>
      <p>The wizard asks for the local database, the remote connection URL, and a retention period. It writes <code>~/.gaet/.env</code> with <code>0600</code> permissions and creates <code>~/.gaet/backups</code>.</p>
      <p>In a container, CI job, or any shell without a TTY, initialization runs non-interactively. It preserves existing settings from the environment file, or auto-detects a local PostgreSQL instance with <code>psql</code>:</p>
      <pre><code>gaet init --yes</code></pre>
      <p>Two presets exist for known schemas: <code>gaet init --preset hindsight</code> and <code>--preset hindsight-hermes</code>. Most users do not need them.</p>

      <h2>Step 3: Verify both connections</h2>
      <pre><code>gaet check
gaet doctor</code></pre>
      <p><code>gaet check</code> tests the client tools, the local database, the remote configuration, and the backup directory. It exits non-zero when a required check fails, which is what a pipeline should gate on. <code>gaet doctor</code> adds configuration diagnostics.</p>

      <h2>Step 4: Create the first backup</h2>
      <pre><code>gaet push --dry-run
gaet push</code></pre>
      <p>The dry run prints the source, the target, and the retention window without writing anything. The real push dumps the local database, validates the archive, saves <code>gaet_YYYYMMDD_HHmmss.dump</code>, then resets and restores the remote database.</p>
      <div class="callout warning"><strong>The remote is replaced, not merged</strong><p>The push drops the remote <code>public</code> schema before restoring. Confirm that <code>GAET_REMOTE_URL</code> points at the database you intend to overwrite.</p></div>

      <h2>Step 5: Confirm the result</h2>
      <pre><code>gaet status
gaet snapshots
gaet log 20</code></pre>
      <p><code>gaet status</code> shows connection state and per-table row counts on both sides. <code>gaet snapshots</code> lists local dumps with size and timestamp. <code>gaet log</code> shows recent operations from <code>gaet.log</code> and <code>cron.log</code>.</p>

      <h2>Next steps</h2>
      <div class="reference-table"><div><strong>Goal</strong><strong>Page</strong></div><div><span>Understand every option</span><a href="/docs/user-guide/configuration">Configuration</a></div><div><span>Pull production data down</span><a href="/docs/user-guide/fetch">Fetch from a remote</a></div><div><span>Recover an earlier state</span><a href="/docs/user-guide/restore">Restore a snapshot</a></div><div><span>Run unattended</span><a href="/docs/user-guide/automatic-backups">Automatic backups</a></div></div>

    {:else if isConfiguration}
      <p class="article-lede">Configure local and remote PostgreSQL connections, retention, and timeouts, then verify the result before the first backup.</p>

      <h2>Inspect the current configuration</h2>
      <p>Gaet reads its configuration from <code>~/.gaet/.env</code>. Print every supported key with its current value, or ask for specific keys:</p>
      <pre><code>gaet get --list
gaet get GAET_LOCAL_DB_NAME GAET_REMOTE_URL
gaet get --json</code></pre>
      <p>The dashboard masks secrets in its <code>masked_config</code> response, but <code>gaet get</code> prints the stored value. Treat terminal output as sensitive.</p>

      <h2>How a value is resolved</h2>
      <p>Three layers decide the effective value of a setting. From highest to lowest priority:</p>
      <div class="reference-table"><div><strong>Layer</strong><strong>Example</strong></div><div><span>Process environment</span><code>GAET_REMOTE_URL=... gaet push</code></div><div><span>Environment file</span><code>~/.gaet/.env</code></div><div><span>Built-in default</span><code>127.0.0.1:5432</code></div></div>
      <p>Because the process environment wins, a pipeline can override the file without editing it. <code>gaet init</code> writes the environment file with <code>0600</code> permissions, and <code>gaet set</code> preserves that mode.</p>

      <h2>Local database</h2>
      <p>A single URL is the shortest form:</p>
      <pre><code>GAET_LOCAL_URL=postgresql://app:secret@127.0.0.1:5432/app_dev</code></pre>
      <p>Individual keys are also supported. Any non-empty individual key overrides the matching part of the URL:</p>
      <div class="reference-table"><div><strong>Key</strong><strong>Default</strong></div><div><code>GAET_LOCAL_DB_HOST</code><span><code>127.0.0.1</code>, or a Unix socket directory</span></div><div><code>GAET_LOCAL_DB_PORT</code><span><code>5432</code></span></div><div><code>GAET_LOCAL_DB_USER</code><span><code>postgres</code></span></div><div><code>GAET_LOCAL_DB_NAME</code><span><code>postgres</code></span></div><div><code>GAET_LOCAL_DB_PASS</code><span>empty</span></div></div>
      <p>When the local password is empty, Gaet falls back to <code>GAET_LOCAL_PASS</code> and then <code>PGPASSWORD</code>. If TCP authentication fails against a local server, the backup routines retry over a Unix domain socket.</p>

      <h2>Remote database</h2>
      <pre><code>GAET_REMOTE_URL=postgresql://user:password@db.example.com:5432/app</code></pre>
      <p><code>GAET_SUPABASE_URL</code> is read as a legacy fallback when <code>GAET_REMOTE_URL</code> is empty. The remote URL is the database that <code>gaet push</code> replaces, so confirm it points at a target you can rebuild.</p>
      <p>Transport security is controlled by <code>GAET_REMOTE_SSLMODE</code>, which defaults to <code>prefer</code>. Use <code>require</code> or <code>verify-full</code> when the server presents a valid certificate.</p>

      <h2>Retention and timeouts</h2>
      <div class="reference-table"><div><strong>Key</strong><strong>Default</strong><strong>Effect</strong></div><div><code>GAET_RETENTION_DAYS</code><span><code>7</code></span><span>Deletes local dumps older than N days after a successful push</span></div><div><code>GAET_TIMEOUT</code><span><code>900</code></span><span>Base timeout in seconds for dump and restore commands</span></div><div><code>GAET_TIMEOUT_PER_GB</code><span><code>300</code></span><span>Extra seconds granted per gigabyte of dump size</span></div><div><code>GAET_DUMP_COMPRESS</code><span><code>9</code></span><span>Compression level from 0 to 9</span></div><div><code>GAET_DUMP_JOBS</code><span><code>0</code></span><span>Parallel dump jobs; values above 1 switch to directory format</span></div></div>
      <p>Timeouts scale with the archive: a 4 GB dump receives the base timeout plus four times <code>GAET_TIMEOUT_PER_GB</code>. For a slow link, raise both values instead of only the base.</p>

      <h2>Change and verify</h2>
      <pre><code>gaet set GAET_RETENTION_DAYS=14
gaet remote set-url postgresql://user:password@db.example.com:5432/app
gaet check
gaet doctor</code></pre>
      <p><code>gaet check</code> validates the client tools and both connections. <code>gaet doctor</code> reports configuration problems with suggestions. Re-run one of them after any change, and restart an active scheduler if you changed how the scheduled command is invoked.</p>

    {:else if isPush}
      <p class="article-lede">Create a compressed snapshot of the local PostgreSQL database, prove the archive is readable, then replace the remote database with it.</p>

      <h2>What a push runs, in order</h2>
      <p>One push is a fixed sequence. When a step fails, Gaet stops and returns a specific exit code instead of continuing.</p>
      <div class="reference-table"><div><strong>Step</strong><strong>What happens</strong></div><div><span>1. Resolve</span><span>Reads both connection settings and locates <code>pg_dump</code>, <code>pg_restore</code>, and <code>psql</code></span></div><div><span>2. Lock</span><span>Creates <code>~/.gaet/backups/.gaet.lock</code> so two operations cannot overlap</span></div><div><span>3. Dump</span><span>Runs <code>pg_dump --format=custom</code> into a temporary <code>.tmp</code> file</span></div><div><span>4. Verify</span><span>Runs <code>pg_restore --list</code> against the archive before publishing it</span></div><div><span>5. Publish</span><span>Renames the temporary file to <code>gaet_YYYYMMDD_HHmmss.dump</code> in one atomic step</span></div><div><span>6. Replace</span><span>Drops <code>public</code> tables, views, and sequences on the remote, then restores the archive</span></div></div>

      <h2>Before the first run</h2>
      <p>You need a reachable local database, a remote URL, and the PostgreSQL client tools on <code>PATH</code>. Confirm all three without changing anything:</p>
      <pre><code>gaet check
gaet push --dry-run</code></pre>
      <p>The dry run prints the source, the target, and the retention window, then exits. It does not dump, lock, or connect to the remote database.</p>

      <h2>Run the push</h2>
      <pre><code>gaet push</code></pre>
      <p>A successful run confirms both steps:</p>
      <pre><code>[ OK ] Dump saved
[ OK ] Synchronization complete!</code></pre>
      <p>The final summary names the remote target and the snapshot size. The snapshot stays on disk after the push. List it with <code>gaet snapshots</code>, and restore from it later without touching the remote.</p>

      <h2>Flags</h2>
      <div class="reference-table"><div><strong>Flag</strong><strong>Effect</strong></div><div><code>--dry-run</code><span>Print the plan and exit without changes</span></div><div><code>--json</code><span>Emit a machine-readable result instead of the console report</span></div><div><code>--cron</code><span>Run in scheduled mode and append to <code>cron.log</code></span></div><div><code>--auto[=N]</code><span>Register a recurring backup every N hours instead of running once</span></div><div><code>--notify=URL</code><span>Accepted by the parser; webhook delivery is not implemented in v1.1.x</span></div></div>

      <h2>What gets replaced</h2>
      <div class="callout warning"><strong>The remote database is not merged</strong><p>Before restoring, Gaet drops every table, view, and sequence in the remote <code>public</code> schema with <code>CASCADE</code>. Objects outside <code>public</code> and installed extensions are left in place. Remote-only data in <code>public</code> is lost.</p></div>
      <p>The restore uses <code>--no-owner --no-acl</code>, so ownership and grants come from the target server rather than the source. If you depend on specific roles, reapply grants after the push.</p>

      <h2>Snapshots and retention</h2>
      <p>After a successful run, Gaet deletes local <code>gaet_*.dump</code>, <code>cron_*.dump</code>, and <code>cloud_*.dump</code> files older than <code>GAET_RETENTION_DAYS</code>. Safety snapshots written before a restore are named <code>safety_*.dump</code> and are not matched by retention, so remove them yourself when they are no longer needed.</p>

      <h2>When it fails</h2>
      <div class="reference-table"><div><strong>Exit</strong><strong>Meaning</strong><strong>First check</strong></div><div><code>80</code><span>Remote URL missing or invalid</span><span><code>gaet remote show</code></span></div><div><code>81</code><span>Local dump failed</span><span><code>gaet check</code>, then run <code>pg_dump</code> manually</span></div><div><code>82</code><span>Remote reset or restore failed</span><span>Remote credentials, disk space, and <code>GAET_REMOTE_SSLMODE</code></span></div><div><code>83</code><span>Another operation holds the lock</span><span><code>gaet status</code>; a stale lock is cleared automatically when its process is gone</span></div><div><code>84</code><span>PostgreSQL tools missing</span><span>Install <code>postgresql-client</code></span></div></div>
      <p>If the remote step fails, the local snapshot stays on disk and the local database was never modified. Fix the remote connection, then run <code>gaet push</code> again; it creates a fresh snapshot and retries the remote restore.</p>

    {:else if isFetch}
      <p class="article-lede">Copy the configured remote PostgreSQL database into the local database, with a safety snapshot taken before anything is overwritten.</p>

      <h2>What a fetch runs, in order</h2>
      <div class="reference-table"><div><strong>Step</strong><strong>What happens</strong></div><div><span>1. Dump</span><span>Runs <code>pg_dump</code> against the remote database into <code>cloud_YYYYMMDD_HHmmss.dump</code></span></div><div><span>2. Safety net</span><span>Dumps the current local database to <code>safety_fetch_*.dump</code> and validates it</span></div><div><span>3. Reset</span><span>Drops <code>public</code> tables, views, and sequences in the local database with <code>CASCADE</code></span></div><div><span>4. Restore</span><span>Restores the remote archive into the local database</span></div><div><span>5. Cleanup</span><span>Deletes the temporary <code>cloud_*.dump</code> after the restore attempt</span></div></div>

      <h2>Preview first</h2>
      <pre><code>gaet fetch --dry-run</code></pre>
      <p>The preview prints the cloud source and the local target. It does not connect to either database and does not write a snapshot.</p>

      <h2>Run a fetch</h2>
      <pre><code>gaet fetch</code></pre>
      <p>In an interactive terminal, Gaet names the local database it is about to overwrite and asks you to type <code>yes</code>. Anything else cancels the operation.</p>
      <p>Non-interactive runs, including CI jobs, refuse to continue without an explicit confirmation flag:</p>
      <pre><code>gaet fetch --yes</code></pre>

      <div class="callout warning"><strong>Local data is replaced</strong><p>Fetch is the reverse of push and is equally destructive. The local <code>public</code> schema is cleared before the remote archive is restored. Use a dedicated development database, not one that holds uncommitted work.</p></div>

      <h2>Recovering from a failed fetch</h2>
      <p>If the reset or restore fails, Gaet keeps the safety snapshot and prints its path in the error. Restore it explicitly:</p>
      <pre><code>gaet snapshots
gaet restore safety_fetch_20260101_120000.dump</code></pre>
      <p>Safety snapshots are not pruned by retention. Delete old ones when you no longer need them.</p>

      <h2>Fetch versus push versus restore</h2>
      <div class="reference-table"><div><strong>Command</strong><strong>Source</strong><strong>Destination</strong></div><div><code>gaet push</code><span>Local database</span><span>Remote database</span></div><div><code>gaet fetch</code><span>Remote database</span><span>Local database</span></div><div><code>gaet restore</code><span>Local snapshot file</span><span>Local database</span></div></div>
      <p><code>gaet fetch --json</code> is accepted by the argument parser, but the fetch path in v1.1.x still prints the human-readable report. Parse <code>gaet status --json</code> or inspect the safety snapshot instead of expecting JSON from fetch.</p>

    {:else if isAutomatic}
      <p class="article-lede">Register a recurring push with the operating system scheduler so backups run without an open terminal.</p>

      <h2>Enable a schedule</h2>
      <pre><code>gaet auto
gaet auto 6</code></pre>
      <p>With no argument, the interval is 6 hours. A numeric argument sets the interval in hours. Gaet registers a oneshot service that runs <code>gaet push --cron</code> on a timer, so each run appends to <code>cron.log</code> rather than the interactive console.</p>
      <p><code>gaet push --auto=6</code> reaches the same scheduler path and is useful when a wrapper script already builds the command line.</p>

      <h2>What is installed per platform</h2>
      <div class="reference-table"><div><strong>Platform</strong><strong>Mechanism</strong><strong>Location</strong></div><div><span>Linux</span><span>systemd user timer</span><code>~/.config/systemd/user/gaet-backup.timer</code></div><div><span>macOS</span><span>launchd agent</span><code>~/Library/LaunchAgents</code></div><div><span>Windows</span><span>Task Scheduler</span><span>Task named with the configured prefix</span></div></div>
      <p>The unit names use <code>GAET_SERVICE_PREFIX</code>, which defaults to <code>gaet</code>. On Linux the timer starts 60 seconds after boot and then repeats with <code>OnUnitActiveSec</code> set to the interval.</p>

      <h2>Check the schedule</h2>
      <pre><code>gaet status
gaet log --filter PUSH</code></pre>
      <p><code>gaet status</code> reports whether the scheduler is active, the configured interval, and the scheduler name. <code>gaet log</code> reads both <code>gaet.log</code> and <code>cron.log</code>, so scheduled runs appear next to manual ones.</p>

      <h2>Stop the schedule</h2>
      <pre><code>gaet stop</code></pre>
      <p><code>gaet stop</code> disables and removes both the backup timer and the dashboard service. It does not delete snapshots or configuration.</p>

      <h2>Keep the dashboard running</h2>
      <pre><code>gaet serve --auto
gaet serve --stop</code></pre>
      <p><code>gaet serve --auto</code> registers a second service that starts the dashboard at boot. The dashboard's schedule form and <code>POST /api/schedule</code> store the interval in <code>GAET_AUTO_BACKUP_HOURS</code> and apply the same platform scheduler.</p>

      <h2>Operational notes</h2>
      <p>Retention is applied after every successful push, so a long-running schedule keeps the backup directory bounded by <code>GAET_RETENTION_DAYS</code>. The local database must be reachable without an interactive password prompt: the scheduled unit starts a fresh process with no terminal, so provide credentials through the environment file or the service environment.</p>
      <p>If the machine was asleep, systemd and launchd run the missed job when it wakes rather than replaying every missed interval. That is usually the behavior you want for a snapshot tool.</p>

    {:else if isEnvironment}
      <p class="article-lede">Environment variables read by the configuration loader and runtime.</p><div class="reference-table"><div><strong>Variable</strong><strong>Purpose</strong></div><div><code>GAET_LOCAL_URL</code><span>Full local PostgreSQL connection URL</span></div><div><code>GAET_LOCAL_DB_HOST</code><span>Local host or socket path, default <code>127.0.0.1</code></span></div><div><code>GAET_LOCAL_DB_PORT</code><span>Local PostgreSQL port, default <code>5432</code></span></div><div><code>GAET_LOCAL_DB_USER</code><span>Local database username, default <code>postgres</code></span></div><div><code>GAET_LOCAL_DB_NAME</code><span>Local database name, default <code>postgres</code></span></div><div><code>GAET_LOCAL_DB_PASS</code><span>Local PostgreSQL password</span></div><div><code>GAET_REMOTE_URL</code><span>Remote PostgreSQL connection URL</span></div><div><code>GAET_SUPABASE_URL</code><span>Legacy fallback for the remote URL</span></div><div><code>GAET_REMOTE_SSLMODE</code><span>Remote SSL mode: <code>require</code>, <code>verify-full</code>, or <code>disable</code>; runtime fallback is <code>prefer</code></span></div><div><code>GAET_RETENTION_DAYS</code><span>Local dump retention, default <code>7</code> days</span></div><div><code>GAET_TIMEOUT</code><span>Base timeout, default <code>900</code> seconds</span></div><div><code>GAET_TIMEOUT_PER_GB</code><span>Extra timeout per GB, default <code>300</code> seconds</span></div><div><code>GAET_PG_TIMEOUT</code><span>Legacy fallback for <code>GAET_TIMEOUT</code></span></div><div><code>GAET_PG_TIMEOUT_PER_GB</code><span>Legacy fallback for <code>GAET_TIMEOUT_PER_GB</code></span></div><div><code>GAET_TABLES</code><span>Table list written by <code>gaet init</code> presets; v1.1.x dump routines do not read it</span></div><div><code>GAET_AUTO_BACKUP_HOURS</code><span>Scheduler interval in hours, default <code>6</code></span></div><div><code>GAET_DASHBOARD_PORT</code><span>Dashboard port, default <code>6161</code></span></div><div><code>GAET_SERVICE_PREFIX</code><span>Scheduler service name prefix, default <code>gaet</code></span></div><div><code>GAET_DIR</code><span>Override the <code>~/.gaet</code> data directory</span></div><div><code>GAET_APP_DIR</code><span>Override the application bundle directory</span></div></div><h2>Precedence</h2><p>Process environment variables take priority over values stored in <code>~/.gaet/.env</code>. The configuration schema shown by <code>gaet get --list</code> covers the connection, retention, and timeout keys; scheduler and path variables are read at runtime and may not appear in that list.</p><h2>Inspect current values</h2><pre><code>gaet get --list
gaet get GAET_REMOTE_URL
gaet export</code></pre><p><code>gaet export</code> prints the loaded environment as shell <code>export</code> statements.</p>
    {:else if isTroubleshooting}
      <p class="article-lede">Diagnose the failures that stop a push, fetch, or restore, starting from the exit code and the first failing layer.</p>

      <h2>Start with the exit code</h2>
      <div class="reference-table"><div><strong>Exit</strong><strong>Layer to inspect</strong></div><div><code>80</code><span>Configuration: missing remote URL or invalid value</span></div><div><code>81</code><span>Local database or local dump</span></div><div><code>82</code><span>Remote database, credentials, or TLS</span></div><div><code>83</code><span>Lock file or a concurrent operation</span></div><div><code>84</code><span>PostgreSQL client tools not found</span></div></div>

      <h2>PostgreSQL tools missing</h2>
      <p>Gaet calls <code>pg_dump</code>, <code>pg_restore</code>, and <code>psql</code>; it does not bundle them. Install the client package and confirm the versions match the server's major version:</p>
      <pre><code>pg_dump --version
pg_restore --version
psql --version</code></pre>
      <p>If the tools are installed but Gaet cannot see them, point at the binaries explicitly with <code>GAET_PG_DUMP</code>, <code>GAET_PG_RESTORE</code>, and <code>GAET_PSQL</code>. This matters for scheduled jobs, which start with a smaller <code>PATH</code> than an interactive shell.</p>

      <h2>Connection refused</h2>
      <p>Check that PostgreSQL is running, that the host and port are correct, and that the server accepts the connection independently of Gaet:</p>
      <pre><code>pg_isready -h localhost -p 5432</code></pre>
      <p>For a local server, Gaet retries over a Unix domain socket when TCP fails. If only the socket works, set <code>GAET_LOCAL_DB_HOST</code> to the socket directory, such as <code>/var/run/postgresql</code>.</p>

      <h2>Authentication failed</h2>
      <p>Verify the user and password for the side that failed. Update the stored value without putting it in shell history when possible:</p>
      <pre><code>gaet set GAET_LOCAL_DB_PASS=secret
gaet remote set-url postgresql://user:secret@host:5432/database
gaet remote show</code></pre>
      <p>Gaet passes passwords through <code>PGPASSWORD</code> in the child process environment and always uses <code>-w</code>, so a missing password fails fast instead of waiting for a prompt.</p>

      <h2>SSL mode mismatch</h2>
      <p><code>GAET_REMOTE_SSLMODE</code> defaults to <code>prefer</code>. Servers that require TLS usually accept <code>require</code>; a private CA or a managed provider with a public certificate works with <code>verify-full</code>. Reserve <code>disable</code> for a trusted local network.</p>
      <pre><code>gaet set GAET_REMOTE_SSLMODE=require</code></pre>

      <h2>Timeout during push or fetch</h2>
      <p>The timeout is the base value plus a per-gigabyte budget. Raise both for a large database or a slow link:</p>
      <pre><code>gaet set GAET_TIMEOUT=1800 GAET_TIMEOUT_PER_GB=600</code></pre>
      <p>A timeout during the remote restore leaves the local snapshot intact. A timeout during the local dump leaves the previous remote state untouched.</p>

      <h2>Operation already running</h2>
      <p>Only one backup operation may run at a time. Gaet creates <code>~/.gaet/backups/.gaet.lock</code> and stores the running process ID inside it. If the process is gone, the next run removes the stale lock automatically.</p>
      <pre><code>gaet status
gaet log 20</code></pre>
      <p>Remove the lock manually only after confirming no <code>gaet</code> process is active. Deleting it during a live restore can corrupt the database.</p>

      <h2>No snapshots found</h2>
      <p><code>gaet restore</code> needs at least one <code>.dump</code> file in <code>~/.gaet/backups</code>. List what is there and check the retention window:</p>
      <pre><code>gaet snapshots
gaet get GAET_RETENTION_DAYS</code></pre>

      <h2>Dashboard port already in use</h2>
      <p>The dashboard binds <code>127.0.0.1:6161</code> by default. Start it on another port, or stop the existing instance:</p>
      <pre><code>gaet serve --port=6162
gaet serve --stop</code></pre>

      <h2>Scheduled backups are not running</h2>
      <pre><code>gaet status
gaet log --filter PUSH
gaet auto 6</code></pre>
      <p>Check that the scheduler is active, then read <code>cron.log</code> through <code>gaet log</code>. The most common cause is a scheduled process that cannot find the PostgreSQL binaries or cannot read the environment file because it runs as a different user.</p>

      <h2>Run diagnostics in order</h2>
      <pre><code>gaet check
gaet doctor
gaet diff
gaet status --json</code></pre>
      <p>Paste the output of <code>check</code> and <code>doctor</code> into an issue; both are designed to describe the failure without exposing passwords.</p>

    {:else if isSdk}
      <p class="article-lede">The Gaet TypeScript SDK is a thin client for the REST API exposed by <code>gaet serve</code>. Use it when a Node.js service needs to trigger or inspect backups.</p>

      <h2>Install</h2>
      <pre><code>npm install @ghaniyyrahmans/gaet
pnpm add @ghaniyyrahmans/gaet
yarn add @ghaniyyrahmans/gaet
bun add @ghaniyyrahmans/gaet</code></pre>
      <p>The package was previously published as <code>@ghanirahmans/gaet</code>. The API is unchanged; only the scope moved. The old name is deprecated and receives no further updates.</p>

      <h2>Start the service</h2>
      <p>The SDK does not talk to PostgreSQL directly. It sends HTTP requests to a local daemon:</p>
      <pre><code>gaet serve
gaet serve --auto</code></pre>
      <p><code>gaet serve</code> starts the dashboard and API at <code>http://127.0.0.1:6161</code>. <code>gaet serve --auto</code> also registers a service so it starts at boot.</p>
      <p>In a Node.js process, the SDK can start and stop that daemon itself:</p>
      <pre><code>import &#123; gaet &#125; from '@ghaniyyrahmans/gaet';

await gaet.startServer(&#123;
  env: &#123;
    GAET_LOCAL_DB_HOST: '127.0.0.1',
    GAET_LOCAL_DB_NAME: 'app_dev',
    GAET_REMOTE_URL: 'postgresql://user:secret@db.example.com:5432/app',
  &#125;,
&#125;);

const result = await gaet.push();
console.log(result.ok, result.msg);

await gaet.stopServer();</code></pre>

      <h2>Call the API</h2>
      <pre><code>import &#123; gaet &#125; from '@ghaniyyrahmans/gaet';

const status = await gaet.status();
if (!status.local_ok) throw new Error('Local database unreachable');

const snapshots = await gaet.snapshots();
const check = await gaet.check();
console.log(check.checks.tools.ok);</code></pre>

      <h2>Available methods</h2>
      <div class="reference-table"><div><strong>Group</strong><strong>Methods</strong></div><div><span>Process</span><code>startServer</code>, <code>stopServer</code></div><div><span>Data movement</span><code>push</code>, <code>fetch</code>, <code>restore</code></div><div><span>Snapshots</span><code>snapshots</code>, <code>deleteSnapshot</code></div><div><span>Diagnostics</span><code>status</code>, <code>check</code>, <code>doctor</code>, <code>diff</code>, <code>logs</code></div><div><span>Discovery</span><code>detect</code>, <code>testRemote</code></div><div><span>Configuration</span><code>getConfig</code>, <code>setConfig</code>, <code>export</code></div></div>

      <h2>Custom client</h2>
      <pre><code>import &#123; GaetClient &#125; from '@ghaniyyrahmans/gaet';

const client = new GaetClient(&#123;
  baseUrl: 'http://127.0.0.1:6161',
  timeout: 120000,
&#125;);

const result = await client.check();</code></pre>
      <p>The default request timeout is 60 seconds. Raise it for large databases: a push over a slow link can legitimately run for minutes.</p>

      <h2>Handle failures</h2>
      <p>Backup operations can fail inside a successful HTTP response. Check <code>ok</code> instead of relying on the status code alone:</p>
      <pre><code>const result = await gaet.push();
if (!result.ok) &#123;
  console.error(result.msg);
&#125;</code></pre>
      <p>A network error means the daemon is unreachable, not that the backup failed. Distinguish the two so a retry does not start a second destructive operation.</p>

      <h2>Security</h2>
      <div class="callout warning"><strong>The API has no authentication</strong><p><code>gaet serve</code> grants configuration writes and destructive database operations to anything that can reach the port. Keep it on <code>127.0.0.1</code>, or place an authenticating reverse proxy in front of it. Never expose it to the public internet.</p></div>
      <p>Protect any application route that calls <code>fetch</code>, <code>restore</code>, or <code>setConfig</code> exactly as you would protect a production database console.</p>

    {:else if isUtilities}
      <p class="article-lede">Configuration, diagnostics, logs, and shell integration commands for day-to-day PostgreSQL operations.</p>

      <h2>Remote connection</h2>
      <pre><code>gaet remote show
gaet remote set-url postgresql://user:password@host:5432/database
gaet remote remove</code></pre>
      <p><code>remote show</code> masks the password in the URL and tests the connection when <code>psql</code> is available. <code>remote remove</code> clears the stored remote URL so a push stops with a configuration error instead of writing to the wrong database.</p>

      <h2>Read and write configuration</h2>
      <pre><code>gaet get --list
gaet get GAET_REMOTE_URL GAET_RETENTION_DAYS
gaet get --json
gaet set GAET_RETENTION_DAYS=14
gaet set GAET_TIMEOUT=1800 GAET_TIMEOUT_PER_GB=600</code></pre>
      <p><code>get</code> accepts any number of keys and supports <code>--json</code>. <code>set</code> accepts multiple <code>KEY=value</code> pairs in one call. Both read and write <code>~/.gaet/.env</code>; process environment variables still take priority over the file.</p>

      <h2>Diagnostics</h2>
      <pre><code>gaet check
gaet check --json
gaet doctor
gaet doctor --json
gaet diff --json</code></pre>
      <p><code>check</code> answers one question: can this machine run a backup now? It tests the client tools, the local database, the remote configuration, and the backup directory. <code>doctor</code> explains what to fix when the answer is no. <code>diff</code> compares table counts and schema between the two databases.</p>
      <p>All three exit non-zero when a required check fails, which makes them safe gates in a script:</p>
      <pre><code>gaet check --json | jq -e '.ok'</code></pre>

      <h2>Logs</h2>
      <pre><code>gaet log
gaet log 100
gaet log --filter PUSH
gaet log --since 2026-01-01
gaet log --follow</code></pre>
      <p>The default is the last 30 lines. <code>--filter</code> matches the action name such as <code>PUSH</code>, <code>FETCH</code>, or <code>RESTORE</code>. <code>--since</code> accepts a date or timestamp, and <code>--follow</code> keeps the stream open. Both <code>gaet.log</code> and <code>cron.log</code> are read, so manual and scheduled runs appear together.</p>

      <h2>Export for a shell session</h2>
      <pre><code>gaet export
eval "$(gaet export)"</code></pre>
      <p><code>export</code> prints the loaded environment as shell <code>export</code> statements. Evaluating it in a subshell is useful for debugging, but it puts secrets into that shell's environment; avoid it in shared sessions.</p>

      <h2>Shell completion</h2>
      <pre><code>gaet completion bash
gaet completion zsh
gaet completion fish
gaet completion powershell</code></pre>
      <p>Print the script and source it from your shell profile, or install it through your package manager's completion directory. The command writes to standard output, so redirect it to the expected path for your shell.</p>

    {:else if isResponses}
      <p class="article-lede">Response shapes returned by the Gaet dashboard API.</p><h2>Conventions</h2><p>Responses are JSON. Mutation endpoints return an <code>ok</code> boolean and a human-readable <code>msg</code>. Backup failures are reported inside a <code>200</code> response with <code>ok: false</code>. Async requests return <code>202</code> with a <code>job_id</code>.</p><h2>Status</h2><pre><code>&#123;
  "local_ok": true,
  "host": "127.0.0.1",
  "port": "5432",
  "user": "postgres",
  "db": "app",
  "has_pass": true,
  "remote_configured": true,
  "remote_host": "db.example.com:5432/app",
  "env_file": "/home/user/.gaet/.env",
  "cron_active": false,
  "cron_hours": 6,
  "scheduler_name": "systemd",
  "tables": [
    &#123; "table": "users", "local": 10, "supabase": 10, "ok": true &#125;
  ]
&#125;</code></pre><p>A table count of <code>-1</code> means the table exists on only one side. <code>ok</code> is true only when both counts match.</p><h2>Snapshot item</h2><pre><code>&#123;
  "name": "gaet_20260101_120000.dump",
  "filename": "gaet_20260101_120000.dump",
  "size_mb": 12.4,
  "mod_time": "2026-01-01 12:00:00",
  "created_at": "2026-01-01T12:00:00Z",
  "full_path": "/home/user/.gaet/backups/gaet_20260101_120000.dump"
&#125;</code></pre><h2>Job</h2><pre><code>&#123;
  "id": "a1b2c3",
  "name": "push",
  "status": "success",
  "msg": "Cloud push completed successfully!",
  "started_at": "2026-01-01T12:00:00Z",
  "finished_at": "2026-01-01T12:00:42Z"
&#125;</code></pre><p><code>status</code> is <code>running</code>, <code>success</code>, or <code>failed</code>. The single-job response also includes an <code>ok</code> field that is false when the job failed.</p><h2>Logs</h2><pre><code>&#123; "logs": ["2026-01-01 12:00:00 PUSH started", "..."] &#125;</code></pre><p>Logs are raw lines from <code>gaet.log</code> and <code>cron.log</code>, oldest first. An empty result returns a single <code>No log entries found.</code> line.</p><h2>Configuration</h2><pre><code>&#123;
  "config": &#123; "GAET_RETENTION_DAYS": "14" &#125;,
  "masked_config": &#123; "GAET_REMOTE_URL": "postgresql://user:****@host/db" &#125;,
  "env_file": "/home/user/.gaet/.env"
&#125;</code></pre><p>Keys containing <code>PASS</code>, <code>SECRET</code>, or <code>URL</code> are masked only in <code>masked_config</code>. Use the masked form when rendering settings.</p><h2>Connection tests</h2><pre><code>&#123;
  "ok": true,
  "connected": true,
  "msg": "Local PostgreSQL ping successful! (postgres@127.0.0.1:5432/app)",
  "output": "Local PostgreSQL ping successful! (postgres@127.0.0.1:5432/app)"
&#125;</code></pre><h2>CLI JSON output</h2><p>The CLI and HTTP handlers use separate response paths. Treat <code>gaet check --json</code>, <code>gaet diff --json</code>, and endpoint responses as command-specific contracts.</p>
    {:else if isSecurity}
      <p class="article-lede">Operational rules for protecting database credentials and avoiding destructive mistakes.</p><h2>How credentials reach PostgreSQL</h2><p>Gaet passes the database password to <code>psql</code>, <code>pg_dump</code>, and <code>pg_restore</code> through the child process environment as <code>PGPASSWORD</code>, never as a command-line argument. Every call also uses <code>-w</code>, so a missing password fails instead of hanging on a prompt.</p><p>The environment file is written with <code>0600</code> permissions, and the configuration API rewrites it with the same mode. The backup lock file is also created with <code>0600</code>.</p><pre><code>chmod 600 ~/.gaet/.env</code></pre><h2>Shell history</h2><p><code>gaet remote set-url</code> and <code>gaet set</code> accept secrets as arguments, which an interactive shell may write to history. Prefer the dashboard configuration form, the <code>POST /api/config</code> endpoint, or an environment variable when history is a concern.</p><h2>Remote TLS</h2><p><code>GAET_REMOTE_SSLMODE</code> defaults to <code>prefer</code>. Use <code>require</code> or <code>verify-full</code> when the remote server supports it, and avoid <code>disable</code> outside a trusted network.</p><pre><code>gaet set GAET_REMOTE_SSLMODE=verify-full</code></pre><h2>Dashboard exposure</h2><p>The dashboard has no built-in authentication and exposes configuration writes, snapshot downloads, and database operations. Keep it on a trusted interface, restrict the port with a firewall, or put an authenticating reverse proxy in front of it.</p><h2>Destructive commands</h2><div class="reference-table"><div><strong>Command</strong><strong>Effect</strong></div><div><code>gaet push</code><span>Resets and replaces objects in the remote database</span></div><div><code>gaet fetch</code><span>Resets and overwrites the local database</span></div><div><code>gaet restore</code><span>Resets the local target before importing a snapshot</span></div><div><code>gaet uninstall</code><span>Removes configuration, scheduler units, and snapshots unless <code>--save</code> is used</span></div></div><p>Use <code>--dry-run</code> where available and confirm the target before adding <code>--yes</code>. In a non-interactive session, fetch, restore, and uninstall refuse to run without it.</p><h2>Concurrency</h2><p>A lock file prevents overlapping backup operations. If a process is killed mid-run, confirm no operation is active before removing a stale lock.</p>
    {:else if isCiCd}
      <p class="article-lede">Run Gaet safely in a non-interactive pipeline.</p><h2>Global flags for automation</h2><div class="reference-table"><div><strong>Flag</strong><strong>Effect</strong></div><div><code>-q, --quiet</code><span>Suppress non-essential output</span></div><div><code>--plain</code><span>Pipe-safe output without ANSI colors</span></div><div><code>--json</code><span>Machine-readable output on supported commands</span></div><div><code>-y, --yes</code><span>Auto-confirm destructive prompts</span></div></div><h2>Exit codes</h2><div class="reference-table"><div><strong>Code</strong><strong>Meaning</strong></div><div><code>0</code><span>Success</span></div><div><code>1</code><span>General failure</span></div><div><code>2</code><span>Usage error or unknown command</span></div><div><code>80</code><span>Configuration error</span></div><div><code>81</code><span>Local database unavailable</span></div><div><code>82</code><span>Remote database unavailable</span></div><div><code>83</code><span>Operation locked by a running backup</span></div><div><code>84</code><span>Required PostgreSQL tools missing</span></div></div><h2>Validate before mutation</h2><pre><code>gaet check --json</code></pre><p>Stop the job when the check fails. The CLI help documents a shell pattern for this:</p><pre><code>gaet check --json | jq '.ok'</code></pre><h2>Run a backup</h2><pre><code>gaet push --json</code></pre><p>Provide credentials through the CI secret manager as environment variables. Process environment variables take priority over the Gaet environment file.</p><pre><code>GAET_LOCAL_URL=postgresql://user:pass@127.0.0.1:5432/app
GAET_REMOTE_URL=postgresql://user:pass@db.example.com:5432/app</code></pre><h2>GitHub Actions</h2><pre><code>- name: Verify Gaet
  run: gaet check --json

- name: Push backup
  run: gaet push --json
  env:
    GAET_LOCAL_URL: &#36;&#123;&#123; secrets.GAET_LOCAL_URL &#125;&#125;
    GAET_REMOTE_URL: &#36;&#123;&#123; secrets.GAET_REMOTE_URL &#125;&#125;</code></pre><h2>Destructive workflows</h2><pre><code>gaet fetch --yes</code></pre><pre><code>gaet restore latest --yes</code></pre><p>Fetch and restore overwrite the local database. Run them only in a job whose target has been selected intentionally, and gate the step behind an environment approval.</p><h2>Pipeline checks</h2><pre><code>gaet status --json
gaet snapshots --json
gaet doctor --json</code></pre><h2>Notifications</h2><p><code>gaet push</code> accepts a <code>--notify=URL</code> argument, but v1.1.x does not send webhook requests. Do not rely on it for alerting yet; surface failures through the process exit code and <code>cron.log</code> instead.</p>
    {:else if isLifecycle}
      <p class="article-lede">Update the Gaet executable or remove Gaet from a machine.</p><h2>Update</h2><pre><code>gaet update</code></pre><p>The command reads the latest GitHub release, compares it with the running version, and when a newer tag exists it runs the platform installer. With no newer release it reports that Gaet is already current.</p><pre><code>gaet update --force</code></pre><p><code>--force</code> reinstalls the binary even when the version matches. Manual downloads for Windows, macOS, and Linux live on the <a href="https://github.com/ghaniyyrahmans/gaet/releases/latest" target="_blank" rel="noreferrer">latest release page ↗</a>. Update only replaces the binary; it does not rewrite <code>~/.gaet/.env</code>.</p><div class="callout"><strong>Package-manager installs</strong><p>If Gaet was installed system-wide, <code>gaet update</code> refuses to self-update and prints the matching package-manager command instead. Use <code>--force</code> only when you deliberately want a user-local copy in <code>~/.local/bin</code>.</p></div><h2>Uninstall</h2><pre><code>gaet uninstall</code></pre><p>Interactively, Gaet offers two modes:</p><div class="reference-table"><div><strong>Mode</strong><strong>Removes</strong></div><div><span>Clean</span><span>Binary, configuration, and backup snapshots</span></div><div><span>Safe</span><span>Binary only; keeps <code>~/.gaet</code> and its data</span></div></div><p>Both modes stop the backup and dashboard scheduler services, remove their unit files, and delete the launcher from <code>~/.local/bin</code>.</p><pre><code>gaet uninstall --save</code></pre><p><code>--save</code> selects the safe mode without prompting. Non-interactive use requires <code>--yes</code>:</p><pre><code>gaet uninstall --yes</code></pre><div class="callout warning"><strong>Backup before removal</strong><p>Clean uninstall deletes <code>~/.gaet</code>, including every snapshot and the environment file. Copy anything you still need, or use <code>--save</code>.</p></div><p>A system-wide installation must be removed with the package manager. <code>gaet uninstall</code> detects that case and prints the correct removal command instead of deleting a user-local copy.</p>
    {:else if isContributing}
      <p class="article-lede">Gaet keeps its runtime dependency-free and treats code as the source of truth for documentation.</p><h2>Set up</h2><pre><code>git clone https://github.com/ghaniyyrahmans/gaet.git
cd gaet
go test ./... -count=1</code></pre><h2>Build</h2><pre><code>go build -ldflags="-s -w" -o gaet ./cmd/gaet</code></pre><h2>Project rules</h2><div class="reference-table"><div><strong>Rule</strong><strong>Expectation</strong></div><div><span>Dependencies</span><span>Standard library only; no third-party Go modules</span></div><div><span>Distribution</span><span>CLI, backup engine, and dashboard ship as one binary</span></div><div><span>Output</span><span>ASCII status tags such as <code>[ OK ]</code> and <code>[FAIL]</code>, no emoji</span></div><div><span>Paths</span><span>Use <code>filepath.Join</code> or <code>os.PathSeparator</code></span></div><div><span>Errors</span><span>Actionable hints and troubleshooting links</span></div></div><h2>Tests</h2><p>The suite is integration-focused: it compiles the binary and drives subcommands. Add coverage in <code>tests/*_test.go</code> for every new command, flag, or fix.</p><pre><code>go test ./... -count=1</code></pre><h2>Documentation drift</h2><pre><code>bash sandbox/verify-docs.sh</code></pre><p>The script must exit <code>0</code>. It checks that every documented <code>gaet</code> command exists in the dispatch, environment keys are backed by source, relative links and anchors resolve, live docs are listed in <code>docs/README.md</code>, SDK methods match <code>sdk/src/client.ts</code>, and documented <code>~/.gaet</code> paths exist in <code>pkg/core/paths.go</code>.</p><p>When the gate fails, update the documentation rather than the gate. If a claim describes behavior that does not exist, either implement it with tests or remove the claim.</p><h2>Branches</h2><p><code>main</code> is the development branch and <code>lts/v1.1</code> is the production release branch. Changes land on <code>main</code>, pass the suite, then move to <code>lts/v1.1</code>.</p>
    {:else if isApi}
      <p class="article-lede">HTTP endpoints exposed by <code>gaet serve</code>.</p><h2>Start the dashboard</h2><pre><code>gaet serve</code></pre><pre><code>gaet serve --no-open</code></pre><p>The default port is <code>6161</code> and can be changed with <code>GAET_DASHBOARD_PORT</code>.</p><h2>Endpoints</h2><div class="reference-table"><div><strong>Method</strong><strong>Path</strong></div><div><code>GET</code><span>/api/status</span></div><div><code>GET</code><span>/api/check</span></div><div><code>GET</code><span>/api/doctor</span></div><div><code>GET</code><span>/api/diff</span></div><div><code>GET</code><span>/api/export</span></div><div><code>GET</code><span>/api/detect</span></div><div><code>GET</code><span>/api/logs</span></div><div><code>POST</code><span>/api/local/test</span></div><div><code>POST</code><span>/api/remote/test</span></div><div><code>GET</code><span>/api/snapshots</span></div><div><code>GET</code><span>/api/snapshots/download</span></div><div><code>POST</code><span>/api/snapshots/delete</span></div><div><code>GET, POST</code><span>/api/config</span></div><div><code>POST</code><span>/api/push</span></div><div><code>POST</code><span>/api/fetch</span></div><div><code>POST</code><span>/api/restore</span></div><div><code>GET, POST, DELETE</code><span>/api/schedule</span></div><div><code>POST</code><span>/api/stop</span></div><div><code>GET</code><span>/api/jobs</span></div><div><code>GET</code><span>/api/jobs/&#123;id&#125;</span></div></div><h2>Status and diagnostics</h2><pre><code>GET /api/status</code></pre><p>Returns <code>local_ok</code>, the resolved host, port, user, and database, whether a password is set, remote configuration state, the environment file path, scheduler state, and per-table row counts.</p><pre><code>GET /api/check
GET /api/doctor
GET /api/diff</code></pre><p>These wrap the matching CLI checks. <code>/api/export</code> returns the environment as shell exports, <code>/api/detect</code> lists local PostgreSQL instances, and <code>/api/logs</code> accepts an optional <code>lines</code> query parameter.</p><h2>Connection tests</h2><pre><code>POST /api/local/test
Content-Type: application/json

&#123;"url": "postgresql://user:pass@127.0.0.1:5432/app"&#125;</code></pre><p>The local test accepts <code>url</code> or <code>local_url</code>. Without a URL it uses the configured local connection. The remote test accepts <code>url</code> or <code>remote_url</code> plus an optional <code>sslmode</code>, and falls back to the configured remote URL.</p><p>Both respond with <code>ok</code>, <code>connected</code>, <code>msg</code>, and <code>output</code>.</p><h2>Snapshots</h2><pre><code>GET /api/snapshots
GET /api/snapshots/download?file=gaet_20260101_120000.dump
POST /api/snapshots/delete?file=gaet_20260101_120000.dump</code></pre><p>Download streams the archive as an attachment. Delete accepts the filename in the query string or in a JSON body as <code>filename</code> or <code>file</code>. Path separators and <code>..</code> are rejected.</p><h2>Configuration</h2><pre><code>GET /api/config</code></pre><p>Returns <code>config</code>, <code>masked_config</code>, and <code>env_file</code>. Keys containing <code>PASS</code>, <code>SECRET</code>, or <code>URL</code> are masked in <code>masked_config</code>.</p><pre><code>POST /api/config
Content-Type: application/json

&#123;"config": &#123;"GAET_RETENTION_DAYS": "14"&#125;&#125;</code></pre><p>An empty value deletes the key. Values that still contain a mask are ignored, so submitting the masked form does not overwrite a stored secret. The environment file is rewritten with <code>0600</code> permissions.</p><h2>Backup operations</h2><pre><code>POST /api/push
Content-Type: application/json

&#123;"dry_run": true&#125;</code></pre><pre><code>POST /api/fetch</code></pre><pre><code>POST /api/restore
Content-Type: application/json

&#123;"filename": "gaet_20260101_120000.dump"&#125;</code></pre><p>Restore defaults to <code>latest</code> when no filename is provided. Fetch and restore always run with confirmation enabled because the request itself is the confirmation.</p><h2>Asynchronous jobs</h2><p>Add <code>?async=1</code> to a push, fetch, or restore request to run it in the background. The response is <code>202</code> with <code>ok</code>, <code>job_id</code>, and <code>status</code>:</p><pre><code>POST /api/push?async=1</code></pre><p>Poll the job:</p><pre><code>GET /api/jobs
GET /api/jobs/&#123;id&#125;</code></pre><h2>Schedule and stop</h2><pre><code>GET /api/schedule</code></pre><p>Returns <code>active</code>, <code>hours</code>, and the platform scheduler name.</p><pre><code>POST /api/schedule
Content-Type: application/json

&#123;"hours": 6&#125;</code></pre><p><code>DELETE /api/schedule</code> and <code>POST /api/stop</code> both stop the scheduler.</p><h2>Status codes</h2><p>Wrong methods return <code>405</code>, invalid snapshot filenames return <code>400</code>, and missing snapshots or jobs return <code>404</code>. A backup operation that fails still returns <code>200</code> with <code>ok: false</code> and a message, so check the body rather than the status code alone.</p>
    {:else if isArchitecture}
      <p class="article-lede">Gaet is a single Go binary with small packages for dispatch, configuration, backups, diagnostics, scheduling, and the dashboard.</p>

      <h2>Package layout</h2>
      <div class="reference-table"><div><strong>Package</strong><strong>Responsibility</strong></div><div><code>cmd/gaet</code><span>Flag extraction, command dispatch, help text, update and uninstall</span></div><div><code>pkg/core</code><span>Environment loading, path resolution, PostgreSQL tool discovery, process execution, locking, and logging</span></div><div><code>pkg/backup</code><span>Push, fetch, restore, snapshots, retention, and safety snapshots</span></div><div><code>pkg/init</code><span>Interactive and non-interactive workspace setup</span></div><div><code>pkg/status</code><span>Status, check, doctor, diff, and table counts</span></div><div><code>pkg/serve</code><span>Dashboard HTTP server, API handlers, and job tracking</span></div><div><code>pkg/scheduler</code><span>systemd, launchd, and Task Scheduler integration</span></div><div><code>pkg/config</code><span><code>get</code>, <code>set</code>, and the supported key catalog</span></div></div>

      <h2>How a command flows</h2>
      <p><code>cmd/gaet/main.go</code> parses global flags, takes the first non-flag argument as the command, and dispatches to a package. Each package returns an error carrying one of the documented exit codes, and <code>main</code> converts it into a process status.</p>
      <p>Configuration is loaded once per command from <code>~/.gaet/.env</code>, with process environment variables taking priority. Paths are derived from <code>GAET_DIR</code> or default to <code>~/.gaet</code>, with snapshots and logs under <code>backups/</code>.</p>

      <h2>Data flow</h2>
      <div class="reference-table"><div><strong>Operation</strong><strong>Source</strong><strong>Intermediate</strong><strong>Destination</strong></div><div><code>push</code><span>Local database</span><span><code>gaet_*.dump</code></span><span>Remote database</span></div><div><code>fetch</code><span>Remote database</span><span><code>cloud_*.dump</code> plus a safety snapshot</span><span>Local database</span></div><div><code>restore</code><span>Local snapshot</span><span>Integrity check</span><span>Local database</span></div></div>
      <p>Dumps use the PostgreSQL custom format. When <code>GAET_DUMP_JOBS</code> is greater than 1, Gaet switches to directory format so <code>pg_dump</code> can parallelize.</p>

      <h2>Concurrency and locking</h2>
      <p>Backup operations share one lock file at <code>~/.gaet/backups/.gaet.lock</code>. The file holds the process ID of the running operation, is created with <code>0600</code> permissions, and is removed on exit. If a process dies, a later run detects the stale PID and clears the lock before retrying once.</p>
      <p>This prevents a scheduled backup and a manual push from resetting the remote database at the same time. It does not coordinate two different machines pointed at the same database.</p>

      <h2>Exit codes</h2>
      <div class="reference-table"><div><strong>Code</strong><strong>Meaning</strong></div><div><code>0</code><span>Success</span></div><div><code>1</code><span>General failure</span></div><div><code>2</code><span>Usage error or unknown command</span></div><div><code>80</code><span>Configuration error</span></div><div><code>81</code><span>Local database unavailable</span></div><div><code>82</code><span>Remote database unavailable</span></div><div><code>83</code><span>Locked by a running operation</span></div><div><code>84</code><span>Required PostgreSQL tools missing</span></div></div>

      <h2>Platform integration</h2>
      <p>Gaet shells out to <code>pg_dump</code>, <code>pg_restore</code>, and <code>psql</code> instead of linking a database driver. Passwords travel through the child process environment as <code>PGPASSWORD</code>, never as a command-line argument, and every call passes <code>-w</code> so a missing password fails instead of hanging on a prompt.</p>
      <p>Local TCP failures fall back to a Unix domain socket, which matches how peer authentication is usually configured on developer machines.</p>

      <h2>Testing</h2>
      <p>The test suite is integration-focused: it compiles the binary and drives subcommands against real PostgreSQL instances. Documentation is checked by <code>sandbox/verify-docs.sh</code>, which fails when a documented command, environment key, path, or SDK method is not present in the source.</p>

    {:else if isRestore}
      <p class="article-lede">Replay a local snapshot into the local PostgreSQL database, with an integrity check and a safety snapshot before anything is dropped.</p>

      <h2>Restore the latest snapshot</h2>
      <pre><code>gaet restore</code></pre>
      <p>With no target, <code>gaet restore</code> selects the newest <code>.dump</code> file in <code>~/.gaet/backups</code>. The keywords <code>latest</code> and <code>last</code> are accepted explicitly.</p>

      <h2>Select a specific snapshot</h2>
      <pre><code>gaet snapshots
gaet restore gaet_20260101_120000.dump
gaet restore 20260101</code></pre>
      <p>Gaet matches the target against file names in the backup directory: an exact file name, a substring such as a date fragment, or a path to a dump file outside the directory. When several files match a substring, the newest one wins; a target that matches nothing stops with an error instead of guessing.</p>

      <h2>Preview the operation</h2>
      <pre><code>gaet restore --dry-run</code></pre>
      <p>The preview prints the snapshot name, its size, and the local database that will be replaced. It performs no writes.</p>
      <div class="callout warning"><strong>Restore drops the local schema first</strong><p><code>gaet restore</code> removes every table, view, and sequence in the local <code>public</code> schema before importing the snapshot. In a non-interactive shell it requires <code>--yes</code>.</p></div>
      <pre><code>gaet restore --yes</code></pre>

      <h2>What Gaet checks before writing</h2>
      <div class="reference-table"><div><strong>Check</strong><strong>Behavior on failure</strong></div><div><span>Snapshot exists</span><span>Stops before touching the database</span></div><div><span>Archive is readable</span><span>Runs <code>pg_restore --list</code>; a corrupt archive stops the restore</span></div><div><span>Recovery point</span><span>Writes <code>safety_restore_*.dump</code> of the current database before the reset</span></div></div>
      <p>If the reset or import fails, the error message includes the safety snapshot path so the previous state can be restored.</p>

      <h2>After a restore</h2>
      <pre><code>gaet status
gaet diff
gaet check --json</code></pre>
      <p><code>gaet status</code> compares table row counts between local and remote. <code>gaet diff</code> reports schema differences. A restore only changes the local database; run <code>gaet push</code> if the restored state should also replace the remote.</p>
      <p><code>gaet restore --json</code> is accepted by the parser, but the restore path in v1.1.x still prints the console summary. Use the exit code for automation.</p>

    {:else if isCli}
      <p class="article-lede">A practical reference for every command exposed by the Gaet CLI.</p><h2>Global options</h2><pre><code>-q, --quiet | --plain | --json | -y, --yes</code></pre><p>Use <code>gaet help &lt;command&gt;</code> for command-specific help. JSON output is command-specific.</p><h2>Command flags</h2><div class="reference-table"><div><strong>Command</strong><strong>Flags</strong></div><div><code>gaet init</code><span><code>--preset=name</code>, <code>-y</code>, <code>--yes</code></span></div><div><code>gaet push</code><span><code>--dry-run</code>, <code>--json</code>, <code>--auto[=N]</code>, <code>--cron</code>, <code>--notify=URL</code></span></div><div><code>gaet fetch</code><span><code>--dry-run</code>, <code>--json</code>, <code>-y</code>, <code>--yes</code></span></div><div><code>gaet restore</code><span><code>[target|latest]</code>, <code>--dry-run</code>, <code>--json</code>, <code>-y</code>, <code>--yes</code></span></div><div><code>gaet snapshots</code><span><code>--json</code></span></div><div><code>gaet status</code><span><code>--json</code></span></div><div><code>gaet check</code><span><code>--json</code></span></div><div><code>gaet doctor</code><span><code>--json</code></span></div><div><code>gaet diff</code><span><code>--json</code></span></div><div><code>gaet remote</code><span><code>show</code>, <code>set-url</code>, <code>remove</code>, optional URL</span></div><div><code>gaet get</code><span><code>[KEY...]</code>, <code>--list</code>, <code>--json</code></span></div><div><code>gaet set</code><span><code>KEY=value [...]</code></span></div><div><code>gaet auto</code><span><code>[interval_hours]</code>, default 6</span></div><div><code>gaet serve</code><span><code>--port=6161</code>, <code>--host=127.0.0.1</code>, <code>--no-open</code>, <code>--auto</code>, <code>--stop</code></span></div><div><code>gaet log</code><span><code>[N]</code>, <code>--filter=KW</code>, <code>--since=DATE</code>, <code>--follow</code></span></div><div><code>gaet completion</code><span><code>bash</code>, <code>zsh</code>, <code>fish</code>, <code>powershell</code></span></div><div><code>gaet update</code><span><code>--force</code>, <code>-f</code></span></div><div><code>gaet uninstall</code><span><code>--save</code>, <code>-y</code>, <code>--yes</code></span></div></div><h2>Commands</h2><div class="reference-table"><div><strong>Command</strong><strong>Purpose</strong></div><a id="init"><code>gaet init</code><span>Interactive setup wizard</span></a><a id="push" href="/docs/user-guide/push-backups"><code>gaet push</code><span>Backup local database to remote</span></a><a id="fetch" href="/docs/user-guide/fetch"><code>gaet fetch</code><span>Overwrite local database from remote</span></a><a id="restore" href="/docs/user-guide/restore"><code>gaet restore</code><span>Restore a local snapshot</span></a><a id="snapshots"><code>gaet snapshots</code><span>List local snapshots</span></a><a id="status"><code>gaet status</code><span>Show sync status</span></a><a id="check"><code>gaet check</code><span>Validate configuration and connections</span></a><a id="doctor"><code>gaet doctor</code><span>Run a comprehensive health check</span></a><a id="diff"><code>gaet diff</code><span>Compare local and remote table state</span></a><a id="remote"><code>gaet remote</code><span>Manage the remote URL</span></a><a id="get"><code>gaet get</code><span>Read configuration values</span></a><a id="set"><code>gaet set</code><span>Write configuration values</span></a><a id="export"><code>gaet export</code><span>Print configuration as shell exports</span></a><a id="auto"><code>gaet auto</code><span>Enable scheduled backups</span></a><a id="stop"><code>gaet stop</code><span>Stop the backup scheduler</span></a><a id="serve"><code>gaet serve</code><span>Start the web dashboard</span></a><a id="log"><code>gaet log</code><span>View backup history logs</span></a><a id="completion"><code>gaet completion</code><span>Generate shell completion</span></a><a id="update"><code>gaet update</code><span>Update Gaet</span></a><a id="uninstall"><code>gaet uninstall</code><span>Remove Gaet</span></a></div>
    {/if}
    <p class="page-updated">Last updated <time datetime={LAST_UPDATED}>{formatUpdated()}</time>. Found an error? <a href="https://github.com/ghaniyyrahmans/gaet/issues">Open an issue</a>.</p>
  </article>
  {#if isInstallation}
    <aside class="on-this-page"><p>On this page</p>
      <a href="#quick-install">Quick install</a>
      <a href="#before-you-start">Before you start</a>
      <a href="#downloads-by-platform">Downloads by platform</a>
      <a href="#install-script">Install script</a>
      <a href="#build-from-source">Build from source</a>
      <a href="#verify-installation">Verify installation</a>
      <a href="#initialize-workspace">Initialize workspace</a>
    </aside>
  {/if}
</div>
