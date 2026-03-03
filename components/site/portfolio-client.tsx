"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Award,
  BriefcaseBusiness,
  ExternalLink,
  Github,
  GraduationCap,
  LineChart,
  Mail,
  Menu,
  Phone,
  Rocket,
  Star,
  Users,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useGsapReveal } from "@/hooks/use-gsap-reveal";
import type { GitHubCredibilityStats, PortfolioData, ProjectDoc } from "@/types/portfolio";

const navItems = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "stellar", label: "Stellar OSS" },
  { id: "projects", label: "Projects" },
  { id: "credibility", label: "GitHub Credibility" },
  { id: "experience", label: "Experience" },
  { id: "awards", label: "Awards" },
  { id: "contact", label: "Contact" },
];

function getImageUrl(imageId?: string, fallback?: string) {
  if (imageId) {
    return `/api/media/${imageId}`;
  }
  return fallback || "/images/emmanuel.png";
}

function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useGsapReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-10 flex flex-col gap-3">
      <p className="chip w-fit">{subtitle}</p>
      <h2 className="text-3xl font-semibold sm:text-4xl">{title}</h2>
    </div>
  );
}

function ProjectCard({ project }: { project: ProjectDoc }) {
  const title = project.name;
  const description = project.description || "Project details will be completed in admin.";
  const repo = project.githubUrl;
  const imageSrc = getImageUrl(project.imageId, project.heroImageUrl || "/placeholder.svg");

  return (
    <article className="surface-card group relative overflow-hidden p-4 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative mb-4 h-40 overflow-hidden rounded-xl border border-border/60 bg-muted/30">
        <Image
          src={imageSrc}
          alt={`${title} preview`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="mb-3 flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {project.featured ? <span className="chip">Featured</span> : null}
      </div>
      <p className="mb-4 text-sm text-muted-foreground">{description}</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {(project.tags || []).slice(0, 4).map((tag) => (
          <span key={`${project._id}-${tag}`} className="chip">
            {tag}
          </span>
        ))}
        {(project.languages || []).slice(0, 2).map((lang) => (
          <span key={`${project._id}-${lang}`} className="chip">
            {lang}
          </span>
        ))}
      </div>
      <div className="mt-auto flex items-center gap-3">
        {repo ? (
          <Link
            href={repo}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            <Github className="h-4 w-4" />
            Source
          </Link>
        ) : (
          <span className="text-sm text-muted-foreground">Repo pending</span>
        )}
        {project.homepage ? (
          <Link
            href={project.homepage}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm font-semibold text-secondary-foreground hover:underline"
          >
            <ExternalLink className="h-4 w-4" />
            Demo
          </Link>
        ) : null}
      </div>
    </article>
  );
}

export function PortfolioClient({
  data,
  githubStats,
}: {
  data: PortfolioData;
  githubStats: GitHubCredibilityStats;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const featuredProjects = useMemo(
    () => data.projects.filter((project) => project.featured),
    [data.projects],
  );

  const stellarProjects = useMemo(() => {
    const lookup = new Map(
      data.projects.map((project) => [project.name.toLowerCase(), project]),
    );

    return data.content.stellarSection.projectNames.map((name) => {
      const match = lookup.get(name.toLowerCase());
      return {
        name,
        url: match?.githubUrl || "",
      };
    });
  }, [data.content.stellarSection.projectNames, data.projects]);

  return (
    <div className="pb-20">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-lg">
        <div className="section-shell flex h-16 items-center justify-between">
          <Link href="#hero" className="font-display text-lg font-semibold tracking-tight">
            Okoye Emmanuel
          </Link>
          <nav className="hidden items-center gap-6 lg:flex">
            {navItems.map((item) => (
              <Link key={item.id} href={`#${item.id}`} className="text-sm font-medium text-muted-foreground transition hover:text-foreground">
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            aria-label="Toggle mobile menu"
            onClick={() => setMenuOpen((value) => !value)}
            className="inline-flex rounded-md p-2 lg:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {menuOpen ? (
          <nav className="section-shell grid gap-3 border-t border-border/70 py-4 lg:hidden">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={`#${item.id}`}
                className="text-sm font-medium"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </header>

      <main>
        <section id="hero" className="section-shell grid gap-10 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:py-24">
          <Reveal>
            <p className="chip mb-4">{data.content.hero.eyebrow}</p>
            <h1 className="mb-4 text-4xl font-semibold leading-tight sm:text-5xl">
              {data.content.hero.name}
            </h1>
            <div className="mb-4 flex flex-wrap gap-2">
              {data.content.hero.roles.map((role) => (
                <span key={role} className="chip">
                  {role}
                </span>
              ))}
            </div>
            <p className="mb-8 max-w-2xl text-base text-muted-foreground sm:text-lg">
              {data.content.hero.description}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link href={data.content.hero.primaryCtaUrl}>{data.content.hero.primaryCtaLabel}</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link href={data.content.hero.secondaryCtaUrl}>{data.content.hero.secondaryCtaLabel}</Link>
              </Button>
            </div>
          </Reveal>

          <Reveal>
            <div className="gradient-stroke rounded-[2rem] p-[1px]">
              <div className="surface-card relative h-[420px] overflow-hidden rounded-[2rem]">
                <Image
                  src={getImageUrl(data.content.hero.heroImageId, data.content.hero.heroImageFallback)}
                  alt="Okoye Emmanuel"
                  fill
                  priority
                  className="object-cover object-top"
                />
              </div>
            </div>
          </Reveal>
        </section>

        <section id="about" className="section-shell py-10 lg:py-16">
          <Reveal>
            <SectionHeading title="Professional engineering for web and blockchain products" subtitle="About" />
            <div className="surface-card grid gap-6 p-6 lg:grid-cols-2 lg:p-8">
              <p className="text-base text-muted-foreground">{data.content.about.summary}</p>
              <p className="text-base text-muted-foreground">{data.content.about.body}</p>
            </div>
          </Reveal>
        </section>

        <section id="skills" className="section-shell py-10 lg:py-16">
          <Reveal>
            <SectionHeading title="Core skill stack" subtitle="Skills" />
          </Reveal>
          <Reveal>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {data.skills.map((skill) => (
                <div key={skill._id || skill.name} className="surface-card p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{skill.category}</p>
                  <h3 className="mt-2 text-base font-semibold">{skill.name}</h3>
                  {skill.level ? <p className="mt-1 text-sm text-muted-foreground">{skill.level}</p> : null}
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="stellar" className="section-shell py-10 lg:py-16">
          <Reveal>
            <SectionHeading title={data.content.stellarSection.title} subtitle="Stellar / Soroban OSS" />
            <div className="surface-card p-6 lg:p-8">
              <p className="mb-3 text-base text-muted-foreground">{data.content.stellarSection.intro}</p>
              <p className="mb-6 text-base font-medium">{data.content.stellarSection.contribution}</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {stellarProjects.map((project) => (
                  <div key={project.name} className="surface-card border border-border/60 p-4">
                    <p className="mb-2 font-semibold">{project.name}</p>
                    {project.url ? (
                      <Link
                        href={project.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <Github className="h-4 w-4" />
                        View repository
                      </Link>
                    ) : (
                      <span className="text-sm text-muted-foreground">Repository pending</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        <section id="projects" className="section-shell py-10 lg:py-16">
          <Reveal>
            <SectionHeading title="Selected projects" subtitle="Projects" />
          </Reveal>
          <Reveal>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {featuredProjects.map((project) => (
                <ProjectCard key={project._id || project.name} project={project} />
              ))}
            </div>
          </Reveal>
        </section>

        <section id="credibility" className="section-shell py-10 lg:py-16">
          <Reveal>
            <SectionHeading title="GitHub credibility" subtitle="Signal for clients" />
          </Reveal>
          <Reveal>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <div className="surface-card p-5">
                <p className="text-xs text-muted-foreground">Public repos</p>
                <p className="mt-2 flex items-center gap-2 text-2xl font-semibold">
                  <Rocket className="h-5 w-5 text-primary" />
                  {githubStats.publicRepos}
                </p>
              </div>
              <div className="surface-card p-5">
                <p className="text-xs text-muted-foreground">Followers</p>
                <p className="mt-2 flex items-center gap-2 text-2xl font-semibold">
                  <Users className="h-5 w-5 text-primary" />
                  {githubStats.followers}
                </p>
              </div>
              <div className="surface-card p-5">
                <p className="text-xs text-muted-foreground">Total stars received</p>
                <p className="mt-2 flex items-center gap-2 text-2xl font-semibold">
                  <Star className="h-5 w-5 text-primary" />
                  {githubStats.totalStars}
                </p>
              </div>
              <div className="surface-card p-5">
                <p className="text-xs text-muted-foreground">Approx commits (365d)</p>
                <p className="mt-2 flex items-center gap-2 text-2xl font-semibold">
                  <LineChart className="h-5 w-5 text-primary" />
                  {githubStats.approxCommitsLastYear}
                </p>
              </div>
              <div className="surface-card p-5">
                <p className="text-xs text-muted-foreground">Merged PRs (365d)</p>
                <p className="mt-2 flex items-center gap-2 text-2xl font-semibold">
                  <Github className="h-5 w-5 text-primary" />
                  {githubStats.mergedPrsLastYear}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Activity summary (last 365 days): {githubStats.activitySummary.pushEvents} push events, {" "}
              {githubStats.activitySummary.pullRequests} PR events, {githubStats.activitySummary.issues} issues, {" "}
              {githubStats.activitySummary.starsGiven} stars given. Data source: {githubStats.source}.
            </p>
          </Reveal>
        </section>

        <section id="experience" className="section-shell py-10 lg:py-16">
          <Reveal>
            <SectionHeading title="Experience timeline" subtitle="Experience" />
          </Reveal>
          <Reveal>
            <div className="space-y-4">
              {data.content.experience.map((item) => (
                <article key={`${item.company}-${item.period}`} className="surface-card p-6">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <span className="chip inline-flex items-center gap-1">
                      <BriefcaseBusiness className="h-3.5 w-3.5" />
                      {item.role}
                    </span>
                    <span className="chip">{item.period}</span>
                    <span className="chip">{item.location}</span>
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">{item.company}</h3>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {item.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </Reveal>
        </section>

        <section className="section-shell py-10 lg:py-16">
          <Reveal>
            <SectionHeading title="Education" subtitle="Resume" />
          </Reveal>
          <Reveal>
            <div className="grid gap-4 lg:grid-cols-3">
              {data.content.education.map((item) => (
                <article key={`${item.school}-${item.period}`} className="surface-card p-5">
                  <p className="chip inline-flex items-center gap-1">
                    <GraduationCap className="h-3.5 w-3.5" />
                    {item.period}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold">{item.degree}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.school}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{item.details}</p>
                </article>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="awards" className="section-shell py-10 lg:py-16">
          <Reveal>
            <SectionHeading title="Awards & recognition" subtitle="Awards" />
          </Reveal>
          <Reveal>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {data.awards.map((award) => (
                <article key={award._id || `${award.title}-${award.year}`} className="surface-card flex flex-col p-5">
                  {award.imageId ? (
                    <div className="relative mb-4 h-40 overflow-hidden rounded-xl border border-border/60">
                      <Image
                        src={getImageUrl(award.imageId, "/placeholder.svg")}
                        alt={award.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 30vw"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <p className="chip w-fit">{award.year}</p>
                  <h3 className="mt-3 text-lg font-semibold">{award.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{award.orgOrEvent}</p>
                  {award.placement ? (
                    <p className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary">
                      <Award className="h-4 w-4" />
                      {award.placement}
                    </p>
                  ) : null}
                  {award.proofUrl ? (
                    <Link
                      href={award.proofUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View proof
                    </Link>
                  ) : null}
                </article>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="contact" className="section-shell py-10 lg:py-16">
          <Reveal>
            <SectionHeading title="Let’s build your next product" subtitle="Contact" />
            <div className="surface-card grid gap-6 p-6 lg:grid-cols-2 lg:p-8">
              <div>
                <p className="mb-4 text-muted-foreground">
                  Available for full-time, contract, and consulting roles across full-stack product delivery and blockchain engineering.
                </p>
                <div className="space-y-2 text-sm">
                  <p className="inline-flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <Link href={data.content.socials.email} className="hover:underline">
                      {data.content.contact.email}
                    </Link>
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <Link href={`tel:${data.content.contact.phone}`}>{data.content.contact.phone}</Link>
                  </p>
                </div>
              </div>
              <div className="grid gap-2 text-sm">
                <Link href={data.content.socials.github} target="_blank" rel="noreferrer" className="chip w-fit hover:bg-muted">
                  GitHub
                </Link>
                <Link href={data.content.socials.linkedin} target="_blank" rel="noreferrer" className="chip w-fit hover:bg-muted">
                  LinkedIn
                </Link>
                <Link href={data.content.socials.x} target="_blank" rel="noreferrer" className="chip w-fit hover:bg-muted">
                  X
                </Link>
                <Link href={data.content.resumeHighlights.resumeUrl} className="chip w-fit hover:bg-muted">
                  Download Resume
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
    </div>
  );
}
