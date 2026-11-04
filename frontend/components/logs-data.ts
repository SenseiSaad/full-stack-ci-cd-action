export type LogSection = {
  heading: string;
  body: string;
};

export type Log = {
  slug: string;
  date: string;
  tag: string;
  title: string;
  summary: string;
  sections: LogSection[];
};

export const LOGS: Log[] = [
  {
    slug: "build-out-of-memory",
    date: "Aug 2026",
    tag: "Incident",
    title: "When a build kept running out of memory",
    summary:
      "A production build failed repeatedly with no clear error. The 908 MB server was running out of memory during TypeScript compilation, and reducing the build's memory use got it compiling reliably again.",
    sections: [
      {
        heading: "What happened",
        body: "Deploys failed during the build step. The error output did not point to any line of code, so the build looked like it was breaking at random.",
      },
      {
        heading: "Finding the cause",
        body: "Checking the server while the build ran showed the real limit: the instance had 908 MB of memory, and TypeScript compilation needed more than that. The process was being killed for using too much memory, which is why the error was hard to read.",
      },
      {
        heading: "What I changed",
        body: "I adjusted the build strategy so it used less memory at once, then verified the application compiled on the same instance. I wrote the steps down so memory usage is the first thing to check next time, instead of guessing at the code.",
      },
    ],
  },
  {
    slug: "getting-a-project-live-on-aws",
    date: "Jul 2026",
    tag: "How-to",
    title: "Getting a project live on AWS",
    summary:
      "After the EC2 server was set up correctly, making the site live was mostly a matter of doing DNS and SSL in the right order. I do not claim zero downtime; the availability the site gets is bounded by AWS itself.",
    sections: [
      {
        heading: "Setting up the server first",
        body: "An EC2 instance running Ubuntu, with Nginx as the reverse proxy, a process manager keeping the app running, and SSL certificates issued with Certbot. Getting this configuration right before touching DNS saves most of the trouble later.",
      },
      {
        heading: "The cutover",
        body: "I moved the site using an EC2 AMI snapshot, then updated the DNS records and re-issued the SSL certificate on the new server. Handling the certificate before switching DNS avoids visitors seeing a certificate warning.",
      },
      {
        heading: "What I do not claim",
        body: "This is not a zero-downtime setup. A single EC2 instance can still be unavailable, and AWS publishes its own availability SLA for that. My part is the configuration and the order of the cutover; the uptime ceiling belongs to the platform.",
      },
    ],
  },
  {
    slug: "why-terraform-state-in-s3",
    date: "Jun 2026",
    tag: "Infra",
    title: "Why I keep Terraform state in S3",
    summary:
      "Terraform state on a laptop is easy to lose or overwrite. Keeping it in S3 leaves one shared copy that can be reviewed before an apply.",
    sections: [
      {
        heading: "The problem with local state",
        body: "Terraform records what it built in a state file. If that file only exists on one machine, it can be lost, changed by mistake, or simply left behind when someone else needs to run an apply.",
      },
      {
        heading: "What I do instead",
        body: "I store the state in S3 so there is one shared copy of it. Before applying changes I read the plan and check what Terraform intends to change, rather than assuming the previous run left everything as expected.",
      },
      {
        heading: "The habit",
        body: "It is a small setup step, not a complicated system. It mainly makes the next change less surprising for whoever runs it.",
      },
    ],
  },
  {
    slug: "deploys-should-be-boring",
    date: "May 2026",
    tag: "Notes",
    title: "Deploys should be boring",
    summary:
      "A short note on keeping releases uneventful: one pipeline, the same steps every time, and logs to read when something fails.",
    sections: [
      {
        heading: "Why it matters",
        body: "A deploy that needs special attention is a deploy that depends on someone remembering the right order. Writing the steps down once and letting a pipeline run them removes that dependency.",
      },
      {
        heading: "What I keep in place",
        body: "One GitHub Actions workflow, the same build and deploy steps on every push, and logs in one place so a failed run can be read instead of guessed at.",
      },
      {
        heading: "What I do not claim",
        body: "This does not prevent every failure. It makes failures easier to see and repeat, which is usually enough to turn a long problem into a short one.",
      },
    ],
  },
];
