<script lang="ts">
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import { navigation } from '$lib/data';
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
</script>

<svelte:head>
  <title>{title} · Gaet Documentation</title>
  <meta name="description" content={title ? `${title} — Gaet Documentation` : 'Gaet Documentation'} />
  <meta property="og:title" content={title ? `${title} · Gaet Documentation` : 'Gaet Documentation'} />
  <meta property="og:description" content={title ? `${title} — Gaet Documentation` : 'Gaet Documentation'} />
  <script type="application/ld+json">{`{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"${page.url.origin}"},{"@type":"ListItem","position":2,"name":"Documentation","item":"${page.url.origin}/docs"},{"@type":"ListItem","position":3,"name":"${title}","item":"${page.url.href}"}]}`}</script>
</svelte:head>
<div class="docs-layout page-shell">
  <aside class="docs-sidebar" aria-label="Documentation navigation">{#each navigation as group}<div class="sidebar-group"><p>{group.label}</p>{#each group.items as item}<a class:current={path === item.href} href={item.href}>{item.title}</a>{/each}</div>{/each}</aside>
  <article class="article" use:addCopyButtons><div class="breadcrumbs"><a href="/">Home</a><span>/</span><span>Documentation</span><span>/</span><span>{title}</span></div><h1>{title}</h1>
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
        <p>All assets are published on the <a href="https://github.com/ghaniyyrahmans/gaet/releases/latest" target="_blank" rel="noreferrer">latest release page ↗</a>. The following links follow the latest published release automatically.</p>

        <div class="download-group">
          <div class="download-group-title"><span class="download-group-os">Windows</span></div>
          <div class="download-options">
            <div class="download-option">
              <span class="download-option-type">exe</span>
              <code class="download-option-asset">gaet-windows-amd64.exe</code>
              <a href="https://github.com/ghaniyyrahmans/gaet/releases/latest/download/gaet-windows-amd64.exe" target="_blank" rel="noreferrer" class="download-option-link">Download ↗</a>
            </div>
            <div class="download-option">
              <span class="download-option-type">exe (arm64)</span>
              <code class="download-option-asset">gaet-windows-arm64.exe</code>
              <a href="https://github.com/ghaniyyrahmans/gaet/releases/latest/download/gaet-windows-arm64.exe" target="_blank" rel="noreferrer" class="download-option-link">Download ↗</a>
            </div>
            <div class="download-option">
              <span class="download-option-type">msi</span>
              <code class="download-option-asset">gaet-windows-amd64.msi</code>
              <a href="https://github.com/ghaniyyrahmans/gaet/releases/latest/download/gaet-windows-amd64.msi" target="_blank" rel="noreferrer" class="download-option-link">Download ↗</a>
            </div>
            <div class="download-option">
              <span class="download-option-type">msi (arm64)</span>
              <code class="download-option-asset">gaet-windows-arm64.msi</code>
              <a href="https://github.com/ghaniyyrahmans/gaet/releases/latest/download/gaet-windows-arm64.msi" target="_blank" rel="noreferrer" class="download-option-link">Download ↗</a>
            </div>
            <div class="download-option">
              <span class="download-option-type">Source code</span>
              <code class="download-option-asset">Source code (zip)</code>
              <a href="https://github.com/ghaniyyrahmans/gaet/releases/latest/download/gaet-windows-amd64.exe" target="_blank" rel="noreferrer" class="download-option-link">Download ↗</a>
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
              <code class="download-option-asset">gaet-darwin.pkg</code>
              <a href="https://github.com/ghaniyyrahmans/gaet/releases/latest/download/gaet-darwin.pkg" target="_blank" rel="noreferrer" class="download-option-link">Download ↗</a>
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
              <span class="download-option-type">.deb</span>
              <code class="download-option-asset">gaet_amd64.deb</code>
              <a href="https://github.com/ghaniyyrahmans/gaet/releases/latest/download/gaet_amd64.deb" target="_blank" rel="noreferrer" class="download-option-link">Download ↗</a>
            </div>
            <div class="download-option">
              <span class="download-option-type">.rpm</span>
              <code class="download-option-asset">gaet_amd64.rpm</code>
              <a href="https://github.com/ghaniyyrahmans/gaet/releases/latest/download/gaet_amd64.rpm" target="_blank" rel="noreferrer" class="download-option-link">Download ↗</a>
            </div>
            <div class="download-option">
              <span class="download-option-type">.pkg.tar.zst</span>
              <code class="download-option-asset">gaet_amd64.pkg.tar.zst</code>
              <a href="https://github.com/ghaniyyrahmans/gaet/releases/latest/download/gaet_amd64.pkg.tar.zst" target="_blank" rel="noreferrer" class="download-option-link">Download ↗</a>
            </div>
          </div>
        </div>

        <p>Filename contains version number, choose the matching package on the release page.</p>
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
      <p class="article-lede">Get Gaet installed, connect it to a local PostgreSQL database, and make your first snapshot.</p>
      <h2>Before you begin</h2><p>Gaet is a command-line toolkit for managing PostgreSQL backups. You will need a working PostgreSQL installation and access to the database you want to protect.</p>
      <div class="callout"><strong>Source of truth</strong><p>These docs describe the current Go engine in the Gaet repository. When in doubt, verify behavior with <code>gaet doctor</code> and <code>gaet status</code>.</p></div>
      <h2>Install Gaet</h2><p>Download the binary for your platform from the <a href="https://github.com/ghaniyyrahmans/gaet/releases/latest" target="_blank" rel="noreferrer">latest release page ↗</a>, or use the install script, then confirm the binary is available:</p><pre><code>gaet --version</code></pre>
      <h2>Initialize a workspace</h2><p>From the machine that will create backups, initialize Gaet:</p><pre><code>gaet init</code></pre><p>The initializer creates the local configuration and backup workspace. Follow its prompts, or use <code>gaet init --yes</code> for a non-interactive setup.</p>
      <h2>Create your first backup</h2><pre><code>gaet push</code></pre><p>Inspect the result with:</p><pre><code>gaet status<br />gaet snapshots</code></pre>
    {:else if isConfiguration}
      <p class="article-lede">Configure local and remote PostgreSQL connections and backup behavior.</p><h2>Inspect configuration</h2><pre><code>gaet get --list</code></pre><p>Use <code>gaet set KEY=value</code> to update configuration. Process environment variables take priority over values loaded from the Gaet environment file.</p><h2>Local database</h2><pre><code>GAET_LOCAL_URL=postgresql://user:password@127.0.0.1:5432/mydb</code></pre><p>Individual settings are also supported: <code>GAET_LOCAL_DB_HOST</code>, <code>GAET_LOCAL_DB_PORT</code>, <code>GAET_LOCAL_DB_USER</code>, <code>GAET_LOCAL_DB_NAME</code>, and <code>GAET_LOCAL_DB_PASS</code>.</p><h2>Remote database</h2><pre><code>GAET_REMOTE_URL=postgresql://user:password@host:5432/database</code></pre><p>Use <code>GAET_REMOTE_SSLMODE</code> to configure the remote SSL mode.</p>
    {:else if isPush}
      <p class="article-lede">Create a local PostgreSQL dump, validate it, and synchronize it to the configured remote database.</p><h2>Preview</h2><pre><code>gaet push --dry-run</code></pre><p>The preview shows the local source, remote target, and retention period without changing either database.</p><h2>Run a push</h2><pre><code>gaet push</code></pre><p>Gaet validates the dump with <code>pg_restore --list</code>, publishes the snapshot, resets remote objects, and restores the snapshot remotely.</p><div class="callout warning"><strong>Remote data is replaced</strong><p>Review <code>GAET_REMOTE_URL</code> before running a push.</p></div><pre><code>gaet push --json</code></pre>
    {:else if isFetch}
      <p class="article-lede">Copy the configured remote PostgreSQL database into the local database.</p><h2>Preview and run</h2><pre><code>gaet fetch --dry-run</code></pre><pre><code>gaet fetch</code></pre><p>Gaet dumps the remote database, creates a safety snapshot, resets the local target, and restores the remote dump locally.</p><div class="callout warning"><strong>Local data will be overwritten</strong><p>Non-interactive use requires <code>--yes</code>.</p></div><pre><code>gaet fetch --yes</code></pre>
    {:else if isAutomatic}
      <p class="article-lede">Run recurring backups through the operating system scheduler.</p><h2>Enable automatic backups</h2><pre><code>gaet auto</code></pre><pre><code>gaet auto 6</code></pre><p>Gaet uses systemd on Linux, launchd on macOS, and Task Scheduler on Windows.</p><h2>Stop the scheduler</h2><pre><code>gaet stop</code></pre>
    {:else if isEnvironment}
      <p class="article-lede">Environment variables read by the configuration loader and runtime.</p><div class="reference-table"><div><strong>Variable</strong><strong>Purpose</strong></div><div><code>GAET_LOCAL_URL</code><span>Full local PostgreSQL connection URL</span></div><div><code>GAET_LOCAL_DB_HOST</code><span>Local host or socket path, default <code>127.0.0.1</code></span></div><div><code>GAET_LOCAL_DB_PORT</code><span>Local PostgreSQL port, default <code>5432</code></span></div><div><code>GAET_LOCAL_DB_USER</code><span>Local database username, default <code>postgres</code></span></div><div><code>GAET_LOCAL_DB_NAME</code><span>Local database name, default <code>postgres</code></span></div><div><code>GAET_LOCAL_DB_PASS</code><span>Local PostgreSQL password</span></div><div><code>GAET_REMOTE_URL</code><span>Remote PostgreSQL connection URL</span></div><div><code>GAET_SUPABASE_URL</code><span>Legacy fallback for the remote URL</span></div><div><code>GAET_REMOTE_SSLMODE</code><span>Remote SSL mode: <code>require</code>, <code>verify-full</code>, or <code>disable</code>; runtime fallback is <code>prefer</code></span></div><div><code>GAET_RETENTION_DAYS</code><span>Local dump retention, default <code>7</code> days</span></div><div><code>GAET_TIMEOUT</code><span>Base timeout, default <code>900</code> seconds</span></div><div><code>GAET_TIMEOUT_PER_GB</code><span>Extra timeout per GB, default <code>300</code> seconds</span></div><div><code>GAET_PG_TIMEOUT</code><span>Legacy fallback for <code>GAET_TIMEOUT</code></span></div><div><code>GAET_PG_TIMEOUT_PER_GB</code><span>Legacy fallback for <code>GAET_TIMEOUT_PER_GB</code></span></div><div><code>GAET_TABLES</code><span>Comma-separated table filter</span></div><div><code>GAET_AUTO_BACKUP_HOURS</code><span>Scheduler interval in hours, default <code>6</code></span></div><div><code>GAET_DASHBOARD_PORT</code><span>Dashboard port, default <code>6161</code></span></div><div><code>GAET_SERVICE_PREFIX</code><span>Scheduler service name prefix, default <code>gaet</code></span></div><div><code>GAET_DIR</code><span>Override the <code>~/.gaet</code> data directory</span></div><div><code>GAET_APP_DIR</code><span>Override the application bundle directory</span></div></div><h2>Precedence</h2><p>Process environment variables take priority over values stored in <code>~/.gaet/.env</code>. The configuration schema shown by <code>gaet get --list</code> covers the connection, retention, and timeout keys; scheduler and path variables are read at runtime and may not appear in that list.</p><h2>Inspect current values</h2><pre><code>gaet get --list
gaet get GAET_REMOTE_URL
gaet export</code></pre><p><code>gaet export</code> prints the loaded environment as shell <code>export</code> statements.</p>
    {:else if isTroubleshooting}
      <p class="article-lede">Use these checks to diagnose common PostgreSQL, backup, and dashboard failures.</p><h2>PostgreSQL tools missing</h2><p>Gaet needs <code>pg_dump</code>, <code>pg_restore</code>, and <code>psql</code> on the machine running the command.</p><h2>Connection refused</h2><p>Check that PostgreSQL is running, verify the host and port, then test independently:</p><pre><code>pg_isready -h localhost -p 5432</code></pre><h2>Authentication failed</h2><p>Verify the configured user and password. Update the local password with <code>gaet set GAET_LOCAL_DB_PASS=...</code>. Check the remote configuration with <code>gaet remote</code>.</p><h2>Timeout during push or fetch</h2><p>Increase the base timeout and size-based budget in seconds:</p><pre><code>gaet set GAET_TIMEOUT=1800 GAET_TIMEOUT_PER_GB=600</code></pre><h2>Operation already running</h2><p>Gaet uses a lock to prevent concurrent backup operations. Confirm no operation is active before removing a stale lock file.</p><h2>SSL mode mismatch</h2><p><code>GAET_REMOTE_SSLMODE</code> accepts <code>require</code>, <code>verify-full</code>, or <code>disable</code>. Choose the mode supported by the remote server.</p><h2>Diagnostics</h2><pre><code>gaet check</code></pre><pre><code>gaet doctor</code></pre><pre><code>gaet status</code></pre><pre><code>gaet log</code></pre>
    {:else if isSdk}
      <p class="article-lede">The Gaet TypeScript SDK wraps the REST API provided by <code>gaet serve</code>.</p><h2>Install</h2><pre><code>npm install @ghaniyyrahmans/gaet</code></pre><p>The SDK README also documents pnpm, Yarn, and Bun.</p><h2>Start the service</h2><pre><code>gaet serve</code></pre><p>The default SDK base URL is <code>http://127.0.0.1:6161</code>. The service may also be started from Node.js with <code>gaet.startServer()</code>.</p><h2>Use the client</h2><pre><code>import &#123; gaet &#125; from '@ghaniyyrahmans/gaet';
const status = await gaet.status();
const result = await gaet.push();</code></pre><h2>Available methods</h2><p>The SDK documents status, push, fetch, restore, snapshots, logs, check, doctor, diff, detect, remote connectivity tests, configuration, and export methods. <code>GaetClient</code> supports a custom base URL, timeout, and fetch implementation.</p><h2>Protect destructive operations</h2><p>The SDK calls the Gaet HTTP service. Keep that service on a trusted interface and protect any application route that can trigger fetch, restore, or configuration changes.</p>
    {:else if isUtilities}
      <p class="article-lede">Configuration, diagnostics, logs, and shell integration commands for day-to-day operation.</p><h2>Remote connection</h2><pre><code>gaet remote show</code></pre><pre><code>gaet remote set-url postgresql://user:password@host:5432/database</code></pre><pre><code>gaet remote remove</code></pre><p><code>remote show</code> masks the password and tests the connection when <code>psql</code> is available.</p><h2>Configuration</h2><pre><code>gaet get --list</code></pre><pre><code>gaet get GAET_REMOTE_URL</code></pre><pre><code>gaet set GAET_RETENTION_DAYS=14</code></pre><p><code>get</code> accepts multiple keys and supports <code>--json</code>. <code>set</code> accepts multiple <code>KEY=value</code> entries.</p><h2>Diagnostics</h2><pre><code>gaet check --json</code></pre><pre><code>gaet doctor --json</code></pre><pre><code>gaet diff --json</code></pre><h2>Logs</h2><pre><code>gaet log</code></pre><pre><code>gaet log 100 --filter PUSH</code></pre><pre><code>gaet log --since 2026-01-01</code></pre><pre><code>gaet log --follow</code></pre><p>Log output defaults to 30 lines.</p><h2>Shell completion</h2><pre><code>gaet completion bash</code></pre><pre><code>gaet completion zsh</code></pre><pre><code>gaet completion fish</code></pre><pre><code>gaet completion powershell</code></pre>
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
gaet doctor --json</code></pre><h2>Notifications</h2><p><code>gaet push</code> accepts <code>--notify=URL</code> to post the result to a webhook, which lets a pipeline surface backup failures without parsing output.</p>
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
      <p class="article-lede">Gaet is a Go CLI with focused packages for configuration, backups, status, scheduling, and the dashboard.</p><div class="reference-table"><div><strong>Package</strong><strong>Responsibility</strong></div><div><code>cmd/gaet</code><span>CLI entry point and dispatch</span></div><div><code>pkg/core</code><span>Environment, PostgreSQL tools, paths, and shared execution</span></div><div><code>pkg/backup</code><span>Push, fetch, restore, snapshots, and retention</span></div><div><code>pkg/status</code><span>Status, checks, doctor, and schema diff</span></div><div><code>pkg/serve</code><span>Dashboard server and HTTP handlers</span></div><div><code>pkg/scheduler</code><span>Platform scheduler integration</span></div></div>
    {:else if isRestore}
      <p class="article-lede">Restore a PostgreSQL database from the latest snapshot or a specific backup.</p><h2>Restore the latest snapshot</h2><p>Gaet targets the latest available snapshot by default:</p><pre><code>gaet restore</code></pre><div class="callout warning"><strong>Review before restoring</strong><p>Use <code>--dry-run</code> to inspect the operation first. Add <code>--yes</code> when running an approved non-interactive restore.</p></div><h2>Select a snapshot</h2><p>List available snapshots, then pass the target to restore:</p><pre><code>gaet snapshots<br />gaet restore &lt;snapshot&gt;</code></pre>
    {:else if isCli}
      <p class="article-lede">A practical reference for every command exposed by the Gaet CLI.</p><h2>Global options</h2><pre><code>-q, --quiet | --plain | --json | -y, --yes</code></pre><p>Use <code>gaet help &lt;command&gt;</code> for command-specific help. JSON output is command-specific.</p><h2>Command flags</h2><div class="reference-table"><div><strong>Command</strong><strong>Flags</strong></div><div><code>gaet init</code><span><code>--preset=name</code>, <code>-y</code>, <code>--yes</code></span></div><div><code>gaet push</code><span><code>--dry-run</code>, <code>--json</code>, <code>--auto[=N]</code>, <code>--cron</code>, <code>--notify=URL</code></span></div><div><code>gaet fetch</code><span><code>--dry-run</code>, <code>--json</code>, <code>-y</code>, <code>--yes</code></span></div><div><code>gaet restore</code><span><code>[target|latest]</code>, <code>--dry-run</code>, <code>--json</code>, <code>-y</code>, <code>--yes</code></span></div><div><code>gaet snapshots</code><span><code>--json</code></span></div><div><code>gaet status</code><span><code>--json</code></span></div><div><code>gaet check</code><span><code>--json</code></span></div><div><code>gaet doctor</code><span><code>--json</code></span></div><div><code>gaet diff</code><span><code>--json</code></span></div><div><code>gaet remote</code><span><code>show</code>, <code>set-url</code>, <code>remove</code>, optional URL</span></div><div><code>gaet get</code><span><code>[KEY...]</code>, <code>--list</code>, <code>--json</code></span></div><div><code>gaet set</code><span><code>KEY=value [...]</code></span></div><div><code>gaet auto</code><span><code>[interval_hours]</code>, default 6</span></div><div><code>gaet serve</code><span><code>--port=6161</code>, <code>--host=127.0.0.1</code>, <code>--no-open</code>, <code>--auto</code>, <code>--stop</code></span></div><div><code>gaet log</code><span><code>[N]</code>, <code>--filter=KW</code>, <code>--since=DATE</code>, <code>--follow</code></span></div><div><code>gaet completion</code><span><code>bash</code>, <code>zsh</code>, <code>fish</code>, <code>powershell</code></span></div><div><code>gaet update</code><span><code>--force</code>, <code>-f</code></span></div><div><code>gaet uninstall</code><span><code>--save</code>, <code>-y</code>, <code>--yes</code></span></div></div><h2>Commands</h2><div class="reference-table"><div><strong>Command</strong><strong>Purpose</strong></div><a id="init"><code>gaet init</code><span>Interactive setup wizard</span></a><a id="push" href="/docs/user-guide/push-backups"><code>gaet push</code><span>Backup local database to remote</span></a><a id="fetch" href="/docs/user-guide/fetch"><code>gaet fetch</code><span>Overwrite local database from remote</span></a><a id="restore" href="/docs/user-guide/restore"><code>gaet restore</code><span>Restore a local snapshot</span></a><a id="snapshots"><code>gaet snapshots</code><span>List local snapshots</span></a><a id="status"><code>gaet status</code><span>Show sync status</span></a><a id="check"><code>gaet check</code><span>Validate configuration and connections</span></a><a id="doctor"><code>gaet doctor</code><span>Run a comprehensive health check</span></a><a id="diff"><code>gaet diff</code><span>Compare local and remote table state</span></a><a id="remote"><code>gaet remote</code><span>Manage the remote URL</span></a><a id="get"><code>gaet get</code><span>Read configuration values</span></a><a id="set"><code>gaet set</code><span>Write configuration values</span></a><a id="export"><code>gaet export</code><span>Print configuration as shell exports</span></a><a id="auto"><code>gaet auto</code><span>Enable scheduled backups</span></a><a id="stop"><code>gaet stop</code><span>Stop the backup scheduler</span></a><a id="serve"><code>gaet serve</code><span>Start the web dashboard</span></a><a id="log"><code>gaet log</code><span>View backup history logs</span></a><a id="completion"><code>gaet completion</code><span>Generate shell completion</span></a><a id="update"><code>gaet update</code><span>Update Gaet</span></a><a id="uninstall"><code>gaet uninstall</code><span>Remove Gaet</span></a></div>
    {:else}
      <p class="article-lede">This page is part of the Gaet documentation reference.</p><h2>Documentation in progress</h2><p>We are building this page directly from the Gaet source repository. The navigation and page structure are ready; the full reference will follow the implementation.</p><div class="callout"><strong>Want to help?</strong><p>Open an issue or propose an improvement in the Gaet repository.</p></div>
    {/if}
  </article>
  <aside class="on-this-page"><p>On this page</p>
    {#if isInstallation}
      <a href="#quick-install">Quick install</a>
      <a href="#before-you-start">Before you start</a>
      <a href="#downloads-by-platform">Downloads by platform</a>
      <a href="#install-script">Install script</a>
      <a href="#build-from-source">Build from source</a>
      <a href="#verify-installation">Verify installation</a>
      <a href="#initialize-workspace">Initialize workspace</a>
    {:else}
      <a href="#main-content">Overview</a>
      <a href="/docs/getting-started/quickstart">Related pages</a>
    {/if}
  </aside>
</div>
