export type Log = {
  date: string;
  tag: string;
  title: string;
  summary: string;
};

export const LOGS: Log[] = [
  {
    date: "Aug 2026",
    tag: "Incident",
    title: "The build that kept dying at 2am",
    summary:
      "A deploy kept failing with no clear error. It turned out the 908 MB server was running out of memory mid-build. Here is how I spotted it and the one change that fixed it.",
  },
  {
    date: "Jul 2026",
    tag: "How-to",
    title: "Moving a live site with almost no downtime",
    summary:
      "Swapping servers without taking a site offline is mostly about doing DNS and SSL in the right order. My checklist for a clean cutover.",
  },
  {
    date: "Jun 2026",
    tag: "Infra",
    title: "Why I keep Terraform state in S3",
    summary:
      "Storing infrastructure state on your laptop is a trap. A short note on remote state, locking, and why your team will thank you.",
  },
  {
    date: "May 2026",
    tag: "Notes",
    title: "Deploys should be boring",
    summary:
      "If a deploy makes you nervous, something is wrong. A few habits that turn releases into a non-event.",
  },
];
