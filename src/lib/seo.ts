export const SITE_URL = "https://gaet.ghaniyyirrahmans.me";
export const SITE_NAME = "Gaet Documentation";
export const REPO_URL = "https://github.com/ghaniyyrahmans/gaet";
export const OG_IMAGE_PATH = "/og/gaet-og.png";

/**
 * Set once per production build so the visible "last updated" line and the
 * TechArticle dateModified value stay in sync with the deployed content.
 */
export const LAST_UPDATED = __BUILD_DATE__;

export function formatUpdated(date = LAST_UPDATED) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export type PageMeta = {
  title: string;
  description: string;
  h1?: string;
};

/** Descriptions stay between 120 and 160 characters. */
export const pageMeta: Record<string, PageMeta> = {
  "/": {
    title: "Gaet: PostgreSQL Backup and Restore CLI",
    description:
      "Official Gaet documentation: install the CLI, connect local and remote PostgreSQL databases, push snapshots, and restore data safely.",
  },
  "/docs": {
    title: "Gaet Documentation: PostgreSQL Backup Guides",
    description:
      "Browse every Gaet guide: quickstart, configuration, push and fetch workflows, restore, scheduling, CLI reference, REST API, and SDK.",
  },
  "/about": {
    title: "About Gaet and This Documentation",
    description:
      "Who maintains the Gaet PostgreSQL backup CLI, how these docs are verified against the source, the MIT license, and where to report issues.",
  },
  "/docs/getting-started/what-is-gaet": {
    title: "What Is Gaet? PostgreSQL Backup Tool Overview",
    description:
      "Gaet is a Go CLI that pushes and fetches PostgreSQL databases, validates every dump, and keeps timestamped local snapshots you can restore.",
    h1: "What is Gaet?",
  },
  "/docs/getting-started/installation": {
    title: "Install Gaet: PostgreSQL Backup CLI Setup",
    description:
      "Install Gaet on Windows, macOS, or Linux with the install script, package, or Go toolchain, then verify pg_dump, pg_restore, and psql.",
    h1: "Install Gaet on Linux, macOS, or Windows",
  },
  "/docs/getting-started/quickstart": {
    title: "Gaet Quickstart: Your First PostgreSQL Backup",
    description:
      "Install Gaet, run gaet init, connect a local PostgreSQL database, and create your first snapshot with gaet push in a few minutes.",
    h1: "Create your first PostgreSQL backup",
  },
  "/docs/user-guide/configuration": {
    title: "Gaet Configuration: PostgreSQL Connections",
    description:
      "Configure local and remote PostgreSQL connections, retention, and timeouts with GAET environment variables, gaet set, and gaet get.",
    h1: "Configure local and remote PostgreSQL",
  },
  "/docs/user-guide/push-backups": {
    title: "Push a PostgreSQL Backup to a Remote Database",
    description:
      "How gaet push dumps a local PostgreSQL database, validates the archive, stores a snapshot, and restores it to your remote database.",
    h1: "Push a backup to a remote database",
  },
  "/docs/user-guide/fetch": {
    title: "Fetch a Remote PostgreSQL Database with Gaet",
    description:
      "Use gaet fetch to dump a remote PostgreSQL database, save a safety snapshot locally, and restore the remote copy into your local database.",
    h1: "Fetch a remote PostgreSQL database",
  },
  "/docs/user-guide/restore": {
    title: "Restore a PostgreSQL Snapshot with Gaet",
    description:
      "Restore the latest snapshot or a specific backup with gaet restore, preview the operation with --dry-run, and avoid overwriting the wrong database.",
    h1: "Restore a PostgreSQL snapshot",
  },
  "/docs/user-guide/automatic-backups": {
    title: "Schedule Automatic PostgreSQL Backups | Gaet",
    description:
      "Enable recurring PostgreSQL backups with gaet auto. Gaet uses systemd on Linux, launchd on macOS, and Task Scheduler on Windows.",
    h1: "Schedule automatic PostgreSQL backups",
  },
  "/docs/user-guide/troubleshooting": {
    title: "Gaet Troubleshooting: PostgreSQL Backup Errors",
    description:
      "Fix missing PostgreSQL tools, connection refused, authentication failures, timeouts, stale locks, and SSL mode errors when running Gaet.",
    h1: "Troubleshoot Gaet and PostgreSQL",
  },
  "/docs/user-guide/utilities": {
    title: "Gaet CLI Utilities: Logs, Config, Diagnostics",
    description:
      "Reference for gaet remote, get, set, check, doctor, diff, log, and shell completion commands used in day-to-day PostgreSQL operations.",
  },
  "/docs/reference/cli": {
    title: "Gaet CLI Reference: Every Command and Flag",
    description:
      "Complete Gaet CLI reference: global flags, command syntax, JSON output, init, push, fetch, restore, status, doctor, serve, and more.",
  },
  "/docs/reference/environment": {
    title: "Gaet Environment Variables Reference",
    description:
      "Every GAET environment variable: local and remote database URLs, SSL mode, retention, timeouts, table filters, and dashboard port.",
  },
  "/docs/reference/rest-api": {
    title: "Gaet REST API Reference: Endpoints and Requests",
    description:
      "HTTP endpoints exposed by gaet serve: status, check, doctor, diff, snapshots, configuration, push, fetch, restore, jobs, and scheduling.",
  },
  "/docs/reference/sdk": {
    title: "Gaet TypeScript SDK for PostgreSQL Backups",
    description:
      "Install @ghaniyyrahmans/gaet, start the local service, and call status, push, fetch, restore, snapshots, logs, and configuration methods.",
  },
  "/docs/reference/responses": {
    title: "Gaet REST API Response Reference",
    description:
      "Response shapes returned by the Gaet dashboard API: status, snapshots, jobs, logs, configuration, and connection test payloads.",
  },
  "/docs/reference/security": {
    title: "Gaet Security: Credentials and Safe Restores",
    description:
      "How Gaet handles PostgreSQL credentials, file permissions, remote TLS, dashboard exposure, and destructive push, fetch, and restore commands.",
  },
  "/docs/reference/ci-cd": {
    title: "Gaet in CI/CD: Automated PostgreSQL Backups",
    description:
      "Run Gaet in pipelines with --json, --yes, and --plain. Mask secrets, check exit codes, and gate destructive fetch or restore steps.",
  },
  "/docs/development/architecture": {
    title: "Gaet Architecture: Go Packages and Data Flow",
    description:
      "How the Gaet codebase is organized: cmd/gaet dispatch plus core, backup, status, serve, and scheduler packages in a single Go binary.",
    h1: "How Gaet is built",
  },
  "/docs/development/contributing": {
    title: "Contributing to Gaet: Build, Test, and Docs",
    description:
      "Set up the Gaet repository, run the Go test suite, follow project rules, and keep documentation in sync with the verification script.",
  },
  "/docs/development/lifecycle": {
    title: "Update and Uninstall Gaet Safely",
    description:
      "Update Gaet from the latest GitHub release or remove it with a clean or safe uninstall, and learn what happens to ~/.gaet data.",
  },
};

const fallbackMeta: PageMeta = {
  title: "Gaet Documentation",
  description:
    "Official documentation for Gaet, a PostgreSQL backup and restore toolkit for developers.",
};

export function normalizePath(pathname: string) {
  if (!pathname || pathname === "/") return "/";
  return pathname.replace(/\/+$/, "") || "/";
}

export function metaFor(pathname: string): PageMeta {
  return pageMeta[normalizePath(pathname)] ?? fallbackMeta;
}

export function absoluteUrl(pathname: string) {
  const path = normalizePath(pathname);
  return `${SITE_URL}${path === "/" ? "/" : path}`;
}

/**
 * Serialize structured data safely. `<` is escaped so a slug can never close
 * the script block early.
 */
export function jsonLdScript(data: unknown) {
  const json = JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
  return `<script type="application/ld+json">${json}</script>`;
}

export const organizationId = `${SITE_URL}/#organization`;
export const websiteId = `${SITE_URL}/#website`;
export const authorId = `${SITE_URL}/#author`;
export const AUTHOR_NAME = "Ghaniyyir Rahman Sudarsono";
export const AUTHOR_URL = "https://github.com/ghaniyyrahmans";

export function authorSchema() {
  return {
    "@type": "Person",
    "@id": authorId,
    name: AUTHOR_NAME,
    url: AUTHOR_URL,
    sameAs: [REPO_URL],
  };
}

export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": organizationId,
    name: "Gaet",
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/og/gaet-logo-512.png`,
    sameAs: [REPO_URL, "https://www.npmjs.com/package/@ghaniyyrahmans/gaet"],
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    description:
      "Official documentation for Gaet, a PostgreSQL backup and restore toolkit.",
    inLanguage: "en",
    publisher: { "@id": organizationId },
  };
}
