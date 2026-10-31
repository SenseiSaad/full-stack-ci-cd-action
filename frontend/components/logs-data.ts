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
      "A production deployment kept failing silently without clear error messages. Traced the root cause to a 908 MB server running out of memory during TypeScript compilation, resolved by optimizing build memory allocation.",
  },
  {
    date: "Jul 2026",
    tag: "How-to",
    title: "Moving a live site with almost no downtime",
    summary:
      "A practical checklist for swapping production servers without taking services offline, focusing on the exact sequence for AWS AMI snapshots, DNS record updates and SSL certificate cutovers.",
  },
  {
    date: "Jun 2026",
    tag: "Infra",
    title: "Why I keep Terraform state in S3",
    summary:
      "Storing infrastructure state locally on a laptop introduces high risk. A short write-up on configuring remote S3 state storage with DynamoDB locking for team safety and reliable deployments.",
  },
  {
    date: "May 2026",
    tag: "Notes",
    title: "Deploys should be boring",
    summary:
      "Establishing solid automation habits and CI/CD pipelines so that software releases become a predictable, stress-free routine rather than a late-night firefighting event.",
  },
];
