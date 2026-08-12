import { createFileRoute, Link } from "@tanstack/react-router";

import { Reveal } from "@/components/site/reveal";
import { ArrowLink, CtaBand, PageHero, Prose, Section } from "@/components/site/primitives";
import { buildArticleJsonLd, buildBreadcrumbJsonLd, buildSeoMeta } from "@/lib/seo";

const blogContent: Record<string, { title: string; date: string; readTime: string; content: string }> = {
  "the-hidden-costs-of-a-bad-hire": {
    title: "The Hidden Costs of a Bad Hire and How to Avoid Them",
    date: "2024-08-15",
    readTime: "8 min read",
    content: `A bad hire costs more than just salary — here's how to identify and prevent costly hiring mistakes before they impact your bottom line.

The true cost of a bad hire goes far beyond the salary you pay. Studies show that a bad hire can cost a company 30% of that employee's first-year earnings. For a $100,000 salary, that's $30,000 lost in recruitment, training, and lost productivity.

## The Hidden Costs

When you factor in all the indirect costs, the impact becomes even more significant:

- Lost productivity during the hiring and training period
- Impact on team morale and culture
- Customer dissatisfaction and potential lost business
- Management time spent on performance issues
- Severance and outplacement costs

## How to Avoid Bad Hires

The key to avoiding bad hires is a structured, data-driven hiring process. Here's what works:

- Define clear role requirements before starting the search
- Use structured interviews with consistent questions
- Check references thoroughly
- Consider working with a staffing partner who specializes in your industry

## The Staffing Partner Advantage

Working with a specialized staffing partner like Career Source Group can significantly reduce the risk of bad hires. Our vetting process includes communication skills assessment, technical skill verification, and culture fit evaluation — before you ever see a resume.`,
  },
  "is-outsourcing-it-staffing-right-for-your-business": {
    title: "Is Outsourcing IT Staffing Right for Your Business?",
    date: "2024-07-22",
    readTime: "7 min read",
    content: `Outsourcing IT staffing can save time and money, but it's not for everyone. Learn when it makes sense and what to look for in a staffing partner.

## When to Consider Outsourcing

Outsourcing IT staffing makes sense when:

- You need to fill positions quickly
- You don't have internal HR resources
- You're hiring for specialized technical roles
- You want to reduce recruitment costs
- You need flexibility in team size

## Benefits of Outsourcing

The benefits of outsourcing IT staffing include:

- Access to a larger talent pool
- Faster time-to-hire
- Reduced recruitment costs
- Expertise in technical hiring
- Flexibility to scale up or down

## What to Look for in a Partner

When choosing a staffing partner, look for:

- Industry expertise in your specific tech stack
- Transparent pricing and communication
- Strong vetting process
- Track record of successful placements
- Understanding of your culture and values`,
  },
  "how-outsourcing-hr-can-save-your-business-time-and-money": {
    title: "How Outsourcing HR Can Save Your Business Time and Money",
    date: "2024-06-10",
    readTime: "6 min read",
    content: `HR outsourcing isn't just for large enterprises. Discover how small and mid-sized businesses benefit from professional HR services.

## The Cost of In-House HR

For small and mid-sized businesses, maintaining a full in-house HR department can be expensive. The costs include:

- Salaries and benefits for HR staff
- HR software and technology
- Training and development
- Compliance and legal risks

## Benefits of HR Outsourcing

Outsourcing HR functions can provide:

- Cost savings of 20-30% compared to in-house
- Access to HR expertise and best practices
- Reduced administrative burden
- Improved compliance with employment laws
- Better employee benefits through economies of scale

## What Can Be Outsourced

Common HR functions that can be outsourced include:

- Recruitment and staffing
- Payroll processing
- Benefits administration
- Employee training
- Compliance management`,
  },
  "how-to-find-the-perfect-staffing-solutions-for-healthcare": {
    title: "How to Find the Perfect Staffing Solutions for Healthcare",
    date: "2024-05-18",
    readTime: "7 min read",
    content: `Healthcare staffing requires specialized knowledge. Here's what to look for in a staffing partner for medical and clinical roles.

## Healthcare Staffing Challenges

Healthcare organizations face unique staffing challenges:

- Specialized skill requirements
- Credential verification
- Compliance with healthcare regulations
- High turnover rates
- Seasonal demand fluctuations

## What to Look for in a Healthcare Staffing Partner

When choosing a healthcare staffing partner:

- Industry expertise and specialization
- Credential verification process
- Compliance knowledge
- Quality assurance measures
- Flexibility and responsiveness

## Benefits of Specialized Staffing

Working with a specialized healthcare staffing partner provides:

- Access to qualified healthcare professionals
- Reduced time-to-fill
- Improved quality of care
- Better compliance with regulations
- Cost-effective staffing solutions`,
  },
  "avoid-these-costly-staffing-mistakes-in-healthcare": {
    title: "Avoid These Costly Staffing Mistakes in Healthcare",
    date: "2024-04-25",
    readTime: "6 min read",
    content: `Healthcare staffing mistakes can have serious consequences. Learn the most common errors and how to avoid them.

## Common Staffing Mistakes

Healthcare organizations often make these costly mistakes:

- Rushing to fill positions without proper vetting
- Ignoring cultural fit in hiring decisions
- Overlooking the importance of communication skills
- Not considering long-term staffing needs
- Relying on a single staffing source

## The Cost of Mistakes

The consequences of healthcare staffing mistakes include:

- Patient care quality issues
- Increased liability risks
- Higher turnover rates
- Staff burnout and morale issues
- Financial losses

## How to Avoid These Mistakes

To avoid costly staffing mistakes:

- Partner with specialized healthcare staffing firms
- Implement structured interview processes
- Verify credentials thoroughly
- Consider long-term staffing strategies
- Build relationships with multiple staffing partners`,
  },
  "cutting-edge-tips-for-streamlining-healthcare-staffing": {
    title: "Cutting-Edge Tips for Streamlining Healthcare Staffing",
    date: "2024-03-12",
    readTime: "8 min read",
    content: `Modern healthcare staffing requires modern solutions. Explore innovative approaches to streamline your hiring process.

## Modern Staffing Approaches

Healthcare organizations are adopting new approaches:

- AI-powered candidate matching
- Predictive analytics for staffing needs
- Automated credential verification
- Digital onboarding processes
- Remote work options

## Technology Solutions

Technology can help streamline staffing:

- Applicant tracking systems
- Video interviewing platforms
- Background check automation
- Workforce management software
- Scheduling optimization tools

## Best Practices

Implement these best practices:

- Standardize your hiring process
- Use data to make staffing decisions
- Build talent pipelines
- Invest in employer branding
- Measure and optimize your recruitment metrics`,
  },
};

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const post = blogContent[params.slug];
    if (!post) {
      return {
        meta: [
          { title: "Post Not Found | Career Source Group" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const description = post.content.split("\n\n")[0] ?? post.content;
    const path = `/blog/${params.slug}`;
    return {
      ...buildSeoMeta({
        title: post.title,
        description,
        path,
        ogType: "article",
      }),
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            buildArticleJsonLd({
              title: post.title,
              description,
              publishedDate: post.date,
            }),
          ),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            buildBreadcrumbJsonLd([
              { name: "Home", url: "/" },
              { name: "Blog", url: "/blog" },
              { name: post.title, url: path },
            ]),
          ),
        },
      ],
    };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const { slug } = Route.useParams();
  const post = blogContent[slug] || {
    title: "Blog Post",
    date: "",
    readTime: "",
    content: "This post is coming soon. Check back later for the full article.",
  };

  return (
    <>
      <PageHero
        eyebrow={`Blog · ${post.readTime}`}
        title={post.title}
        body={post.date ? `Published ${post.date}` : undefined}
      />

      <Section>
        <Prose content={post.content} />
      </Section>

      <Section className="border-t border-border">
        <ArrowLink to="/blog" label="← Back to all posts" />
      </Section>

      <CtaBand />
    </>
  );
}
