export const company = {
  name: "Career Source Group",
  legalName: "Career Source Group, LLC",
  address: "6040 Yorkridge Dr, Alpharetta, Georgia, 30005, United States",
  phone: "(443) 875-9677",
  phoneHref: "tel:+14438759677",
  email: "hello@careersourcegroup.com",
  tagline:
    "US staffing and talent delivery across the US, LATAM, and Pakistan — direct hire, contract, and contract-to-hire under one contract, one invoice, one point of contact.",
  hours: [
    ["Monday", "9 AM – 5 PM"],
    ["Tuesday", "9 AM – 5 PM"],
    ["Wednesday", "9 AM – 5 PM"],
    ["Thursday", "9 AM – 5 PM"],
    ["Friday", "9 AM – 5 PM"],
    ["Saturday", "Closed"],
    ["Sunday", "Closed"],
  ] as const,
};

export const navLinks = [
  { label: "Services", to: "/services" },
  { label: "How Pods Work", to: "/pods" },
  { label: "Global Delivery", to: "/global-delivery" },
  { label: "Why CSG", to: "/why-csg" },
  { label: "About", to: "/about" },
] as const;

export const specialties = [
  {
    slug: "ai-ml",
    title: "AI & ML Engineering",
    tagline: "The hardest hire in the world right now. We do it weekly.",
  },
  {
    slug: "mlops",
    title: "MLOps Engineering",
    tagline: "The role most companies hire six months too late.",
  },
  {
    slug: "data",
    title: "Data Engineering, Data Science & Analytics",
    tagline: "Every AI roadmap runs on a data team you haven't built yet.",
  },
  {
    slug: "devops",
    title: "DevOps Engineering",
    tagline: "Not a nice-to-have. A mission-critical operating model.",
  },
  {
    slug: "devsecops",
    title: "DevSecOps & Platform Engineering",
    tagline: "The 10-20% premium nobody warned you about.",
  },
  {
    slug: "cloud",
    title: "Cloud Engineering & Architecture",
    tagline: "Cloud and AI stopped being separate career paths.",
  },
  {
    slug: "software-dev",
    title: "Software Development",
    tagline: "The market split. Here's which side you're hiring on.",
  },
  {
    slug: "product",
    title: "Product & Project Management",
    tagline:
      "The fastest-growing salary line in tech, and almost nobody is watching it.",
  },
] as const;

export const specialtyTags = ["Specialist", "Pod", "Contract", "Full-Time"] as const;

export const regionCards = [
  {
    to: "/global-delivery/us",
    title: "US Staffing",
    body: "Direct hire, contract, and contract-to-hire. Full time zone overlap. Best for leadership, client-facing, and compliance-sensitive roles.",
    cta: "See US Services",
  },
  {
    to: "/global-delivery/latam",
    title: "LATAM Nearshore",
    body: "Contract only. 30-70% less than US cost, near-full time zone overlap. Best for core product engineering and daily collaboration.",
    cta: "See LATAM Services",
  },
  {
    to: "/global-delivery/pakistan",
    title: "Pakistan Offshore",
    body: "Contract only. 50-70% less than US cost. Best for execution-heavy work, maintenance, and overnight coverage.",
    cta: "See Pakistan Services",
  },
] as const;

export type Faq = { q: string; a: string; audience: "clients" | "talent" };

export const faqs: Faq[] = [
  {
    audience: "clients",
    q: "Why do you charge 10% for direct hire when the industry charges 20-30%?",
    a: "We charge 10% of annual salary for direct hire. Standard US staffing fees run 15-30% of first-year salary, so on a $150,000 hire that's $30,000-$45,000 to a staffing firm versus our $15,000. Same vetting, same guarantee. On five hires a year, that's a quarter of a million dollars back in your budget.",
  },
  {
    audience: "clients",
    q: "What's the difference between a single specialist and a consulting pod?",
    a: "A specialist is one person placed into a seat you have already defined. A pod is a complete, purpose-built team delivered under one contract, one invoice, and one point of contact. We size every pod against four variables — experience, communication skills, technical skills, and cost — and geography is decided only after the first three are settled.",
  },
  {
    audience: "clients",
    q: "Do you place contract or full-time talent, or both?",
    a: "Both, and which is available depends on the region. In the US we place direct hire, contract, and contract-to-hire. LATAM nearshore and Pakistan offshore are contract only. Direct hire is 10% of first-year salary; contract workers sit on our payroll with compliance handled, so you get a bill rate instead of a headcount req.",
  },
  {
    audience: "clients",
    q: "What's the difference between nearshore (LATAM) and offshore (Pakistan) staffing?",
    a: "Time zone overlap is the real difference. LATAM nearshore runs one to three hours from US time, so your standup is their standup — it suits anything needing daily collaboration, at 30-70% less than US cost. Pakistan offshore is 50-70% less and needs structured overlap hours, so it fits execution-heavy, maintenance, and overnight work.",
  },
  {
    audience: "clients",
    q: "How do I know which region a role should go to?",
    a: "Nearshore for anything that needs live back-and-forth. Offshore for anything that doesn't. US for anything that has to be in the room. Most companies don't need to pick one — they need someone who can tell them which parts of the work go where. We sell all three regions, so we have no reason to push one over another.",
  },
  {
    audience: "clients",
    q: "What will my current offer actually buy in each region?",
    a: "Give us the offer — base, bonus, equity, remote flexibility, and how fast you need someone — and before we source a single candidate we'll tell you what it realistically buys in the US market and how long that search will take, what it buys in LATAM, and what it buys in Pakistan. Then you decide.",
  },
  {
    audience: "clients",
    q: "How fast can you deliver a shortlist?",
    a: "Send us one open req and we'll have profiles in front of you this week, before you commit to anything — no commitment, no retainer. Ramp then differs by region: LATAM and Pakistan starts run days to weeks, while US direct-hire cycles are the slow path across the market at four to six months.",
  },
  {
    audience: "clients",
    q: "How is a pod different from a staff-aug team?",
    a: "Staff augmentation hands you people; a pod hands you a team with an owner. Running it the traditional way means five separate searches, five separate rates, and three vendors — and six months later, four of the five seats filled and nobody accountable for how they work together. A pod is one SOW, one invoice, one person you call.",
  },
  {
    audience: "clients",
    q: "Can a pod include both contract and full-time hires?",
    a: "Engagement basis is set per seat, and what is available depends on where the seat sits. US seats can be direct hire, contract, or contract-to-hire; LATAM and Pakistan seats are contract only. Whatever the mix, the pod is still delivered as one SOW, one invoice, and one point of contact.",
  },
  {
    audience: "talent",
    q: "Do you place both contract and full-time roles?",
    a: "Both, depending on where you are. US-based roles come as direct hire, contract, and contract-to-hire. LATAM and Pakistan placements are contract, dedicated to one client team and embedded in that team's sprint cycle, tools, and rituals — with payroll, compliance, and employment infrastructure handled by us.",
  },
  {
    audience: "talent",
    q: "What specialties do you recruit for?",
    a: "Eight technical practices: AI/ML engineering, MLOps, data engineering and data science, DevOps, DevSecOps and platform engineering, cloud engineering and architecture, software development, and product and project management. We also place non-tech operations roles: customer success, revenue operations, finance and accounting ops, and back-office.",
  },
  {
    audience: "talent",
    q: "Do you work with candidates outside the US?",
    a: "Yes. We deliver dedicated nearshore talent from LATAM and offshore talent from Pakistan to US client teams, both on a contract basis. Those placements are embedded in the client's sprint cycle and tools rather than handed work over a wall, and we handle payroll, compliance, and employment infrastructure.",
  },
  {
    audience: "talent",
    q: "How does the pod model work if I'm the one being placed?",
    a: "You are placed into a defined seat on a purpose-built team, not dropped into an open req. Every seat is scored on communication first and on technical skill against the client's actual stack second. An engineering pod typically pairs a US technical lead who owns architecture and client communication with LATAM and Pakistan engineers.",
  },
  {
    audience: "talent",
    q: "What do you vet for?",
    a: "Communication before anything else — people in standups, client calls, and architecture debates are assessed differently than people executing against a well-defined ticket. Technical skill is vetted against the client's actual stack rather than a keyword match: real code review, stack-specific depth, and system design at their scale.",
  },
];

export function faqsByQuestion(questions: string[]): Faq[] {
  return questions
    .map((q) => faqs.find((f) => f.q === q))
    .filter((f): f is Faq => Boolean(f));
}

export const ctaBand = {
  title: "Ready to see what this looks like for you?",
  body: "Send us one open req you've been sitting on. We'll have profiles in front of you this week, before you commit to anything.",
  primary: { label: "Send a Req", to: "/get-started" },
  secondary: { label: "Contact Us", to: "/contact" },
} as const;

export const footerColumns = [
  {
    title: "Specialties",
    links: specialties.map((s) => ({ label: s.title, to: `/services/${s.slug}` })),
  },
  {
    title: "Delivery",
    links: [
      { label: "Compare Regions", to: "/global-delivery" },
      { label: "US Staffing", to: "/global-delivery/us" },
      { label: "LATAM Nearshore", to: "/global-delivery/latam" },
      { label: "Pakistan Offshore", to: "/global-delivery/pakistan" },
      { label: "How Pods Work", to: "/pods" },
      { label: "What your offer buys", to: "/offer-calibration" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Why CSG", to: "/why-csg" },
      { label: "About", to: "/about" },
      { label: "Blog", to: "/blog" },
      { label: "Contact", to: "/contact" },
      { label: "FAQ", to: "/faq" },
    ],
  },
  {
    title: "Get Started",
    links: [
      { label: "Submit a Requirement", to: "/get-started" },
      { label: "Join Our Bench", to: "/join-our-bench" },
      { label: "Terms & Conditions", to: "/terms" },
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Refund Policy", to: "/refund" },
    ],
  },
] as const;
