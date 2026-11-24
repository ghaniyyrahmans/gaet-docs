export type NavGroup = {
  label: string;
  items: { title: string; href: string }[];
};

export const navigation: NavGroup[] = [
  {
    label: "Getting started",
    items: [
      { title: "What is Gaet?", href: "/docs/getting-started/what-is-gaet" },
      { title: "Installation", href: "/docs/getting-started/installation" },
      { title: "Quickstart", href: "/docs/getting-started/quickstart" },
    ],
  },
  {
    label: "User guide",
    items: [
      { title: "Configuration", href: "/docs/user-guide/configuration" },
      { title: "Push a backup", href: "/docs/user-guide/push-backups" },
      { title: "Fetch from a remote", href: "/docs/user-guide/fetch" },
      { title: "Restore a snapshot", href: "/docs/user-guide/restore" },
      {
        title: "Automatic backups",
        href: "/docs/user-guide/automatic-backups",
      },
      { title: "Troubleshooting", href: "/docs/user-guide/troubleshooting" },
      { title: "CLI utilities", href: "/docs/user-guide/utilities" },
    ],
  },
  {
    label: "Reference",
    items: [
      { title: "CLI reference", href: "/docs/reference/cli" },
      { title: "Environment variables", href: "/docs/reference/environment" },
      { title: "REST API", href: "/docs/reference/rest-api" },
      { title: "TypeScript SDK", href: "/docs/reference/sdk" },
      { title: "REST API responses", href: "/docs/reference/responses" },
      { title: "Security and safety", href: "/docs/reference/security" },
      { title: "CI/CD integration", href: "/docs/reference/ci-cd" },
    ],
  },
  {
    label: "Development",
    items: [
      { title: "Architecture", href: "/docs/development/architecture" },
      { title: "Contributing", href: "/docs/development/contributing" },
      {
        title: "Updating and uninstalling",
        href: "/docs/development/lifecycle",
      },
    ],
  },
];

export const quickLinks = [
  {
    eyebrow: "Start here",
    title: "Quickstart",
    description: "Install Gaet and create your first PostgreSQL snapshot.",
    href: "/docs/getting-started/quickstart",
    number: "01",
  },
  {
    eyebrow: "Core workflow",
    title: "Push a backup",
    description: "Understand how Gaet captures and stores a backup.",
    href: "/docs/user-guide/push-backups",
    number: "02",
  },
  {
    eyebrow: "Recovery",
    title: "Restore a snapshot",
    description: "Bring a database back from a known snapshot.",
    href: "/docs/user-guide/restore",
    number: "03",
  },
];

export const commands = [
  {
    name: "init",
    description: "Initialize a Gaet workspace",
    href: "/docs/reference/cli#init",
  },
  {
    name: "push",
    description: "Create a PostgreSQL backup",
    href: "/docs/user-guide/push-backups",
  },
  {
    name: "fetch",
    description: "Fetch backups from a remote",
    href: "/docs/user-guide/fetch",
  },
  {
    name: "restore",
    description: "Restore a selected snapshot",
    href: "/docs/user-guide/restore",
  },
  {
    name: "status",
    description: "Inspect system and backup status",
    href: "/docs/reference/cli#status",
  },
  {
    name: "doctor",
    description: "Diagnose the local setup",
    href: "/docs/reference/cli#doctor",
  },
];

export const searchItems = [
  ...navigation.flatMap((group) =>
    group.items.map((item) => ({
      ...item,
      group: group.label,
      description: item.title,
    })),
  ),
  ...commands.map((command) => ({
    title: `gaet ${command.name}`,
    description: command.description,
    href: command.href,
    group: "CLI reference",
  })),
];
