"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Award,
  Blocks,
  BriefcaseBusiness,
  Code2,
  ExternalLink,
  Globe,
  Github,
  GraduationCap,
  LineChart,
  Mail,
  Menu,
  Phone,
  Rocket,
  Sparkles,
  Star,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  SiGithubactions,
  SiJavascript,
  SiLinux,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRust,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";

import Hero from "@/app/components/Hero";
import { useGsapReveal } from "@/hooks/use-gsap-reveal";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { stellarContributionRepoUrls } from "@/lib/default-data";
import type { GitHubCredibilityStats, PortfolioData, ProjectDoc } from "@/types/portfolio";

gsap.registerPlugin(ScrollTrigger);

const curatedProjectStacks: Record<string, string[]> = {
  Reapvest: ["React", "JavaScript", "MongoDB"],
  ChainMove: ["Next.js", "Node.js", "MongoDB"],
  Suibuy: ["Next.js", "Node.js", "Tailwind CSS"],
  SmartFin: ["Next.js", "TypeScript", "MongoDB"],
  Swift: ["Next.js", "TypeScript", "Tailwind CSS"],
  "Zeus Scholarly": ["Next.js", "TypeScript", "Python"],
  Cresa: ["Next.js", "Node.js", "MongoDB"],
  Governator: ["React", "Solidity", "JavaScript"],
  Easybuy: ["Next.js", "Node.js", "MongoDB"],
  Camsole: ["React", "Node.js", "MongoDB"],
};

type TechVisual = {
  imageSrc?: string;
  icon?: React.ComponentType<{ className?: string }>;
  shellClassName: string;
  iconClassName: string;
};

const fallbackTechVisual: TechVisual = {
  icon: Code2,
  shellClassName: "bg-white/10 ring-1 ring-white/15",
  iconClassName: "text-slate-100",
};

const techVisuals: Record<string, TechVisual> = {
  typescript: {
    icon: SiTypescript,
    shellClassName: "bg-[#3178c6]/15 ring-1 ring-[#3178c6]/30",
    iconClassName: "text-[#69b7ff]",
  },
  javascript: {
    icon: SiJavascript,
    shellClassName: "bg-[#f7df1e]/15 ring-1 ring-[#f7df1e]/30",
    iconClassName: "text-[#f7df1e]",
  },
  python: {
    icon: SiPython,
    shellClassName: "bg-[#3776ab]/15 ring-1 ring-[#3776ab]/30",
    iconClassName: "text-[#7cc5ff]",
  },
  rust: {
    icon: SiRust,
    shellClassName: "bg-[#ce422b]/15 ring-1 ring-[#ce422b]/30",
    iconClassName: "text-[#ff8b6c]",
  },
  solidity: {
    imageSrc: "/logos/solidity.png",
    shellClassName: "bg-white/10 ring-1 ring-white/15",
    iconClassName: "text-slate-100",
  },
  nextjs: {
    icon: SiNextdotjs,
    shellClassName: "bg-white/10 ring-1 ring-white/15",
    iconClassName: "text-white",
  },
  react: {
    icon: SiReact,
    shellClassName: "bg-[#61dafb]/12 ring-1 ring-[#61dafb]/25",
    iconClassName: "text-[#61dafb]",
  },
  tailwindcss: {
    icon: SiTailwindcss,
    shellClassName: "bg-[#38bdf8]/15 ring-1 ring-[#38bdf8]/30",
    iconClassName: "text-[#67d5ff]",
  },
  nodejs: {
    icon: SiNodedotjs,
    shellClassName: "bg-[#5fa04e]/15 ring-1 ring-[#5fa04e]/30",
    iconClassName: "text-[#7fd46b]",
  },
  mongodb: {
    imageSrc: "/logos/mongodb.png",
    shellClassName: "bg-[#47a248]/15 ring-1 ring-[#47a248]/30",
    iconClassName: "text-[#7ad57b]",
  },
  postgresql: {
    icon: SiPostgresql,
    shellClassName: "bg-[#336791]/15 ring-1 ring-[#336791]/30",
    iconClassName: "text-[#7ab7ee]",
  },
  redis: {
    imageSrc: "/logos/redis.png",
    shellClassName: "bg-[#d82c20]/15 ring-1 ring-[#d82c20]/30",
    iconClassName: "text-[#ff7f75]",
  },
  docker: {
    imageSrc: "/logos/docker.png",
    shellClassName: "bg-[#1d63ed]/15 ring-1 ring-[#1d63ed]/30",
    iconClassName: "text-[#77a8ff]",
  },
  flask: {
    imageSrc: "/logos/flask.png",
    shellClassName: "bg-white/10 ring-1 ring-white/15",
    iconClassName: "text-white",
  },
  githubactions: {
    icon: SiGithubactions,
    shellClassName: "bg-[#2088ff]/15 ring-1 ring-[#2088ff]/30",
    iconClassName: "text-[#70b2ff]",
  },
  linux: {
    icon: SiLinux,
    shellClassName: "bg-[#fbc02d]/15 ring-1 ring-[#fbc02d]/30",
    iconClassName: "text-[#ffd86c]",
  },
  soroban: {
    icon: Blocks,
    shellClassName: "bg-primary/15 ring-1 ring-primary/30",
    iconClassName: "text-primary",
  },
  stellarsdk: {
    icon: Globe,
    shellClassName: "bg-secondary/15 ring-1 ring-secondary/30",
    iconClassName: "text-secondary",
  },
  gsap: {
    icon: Sparkles,
    shellClassName: "bg-[#88ce02]/15 ring-1 ring-[#88ce02]/30",
    iconClassName: "text-[#b7eb63]",
  },
};

function normalizeTechLabel(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function getTechVisual(label: string) {
  return techVisuals[normalizeTechLabel(label)] || fallbackTechVisual;
}

function getProjectStacks(project: ProjectDoc) {
  const explicitStacks = [...project.tags, ...(project.languages || [])].filter(Boolean);
  const fallbackStacks = curatedProjectStacks[project.name] || [];
  return Array.from(new Set((explicitStacks.length ? explicitStacks : fallbackStacks).slice(0, 8)));
}

function splitForRows<T>(items: T[]) {
  const first: T[] = [];
  const second: T[] = [];

  items.forEach((item, index) => {
    if (index % 2 === 0) {
      first.push(item);
      return;
    }

    second.push(item);
  });

  return [first, second] as const;
}

function getImageUrl(imageId?: string, fallback?: string) {
  if (imageId) return `/api/media/${imageId}`;
  return fallback || "/images/emmanuel.png";
}

function SectionHeading({
  title,
  subtitle,
  accent,
}: {
  title: string;
  subtitle: string;
  accent?: string;
}) {
  return (
    <div className="mb-12 flex flex-col gap-4">
      <p className="chip w-fit border-primary/30 bg-primary/10 text-primary">{subtitle}</p>
      <h2 className="max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {accent ? <p className="max-w-2xl text-base text-muted-foreground">{accent}</p> : null}
    </div>
  );
}

function Reveal({
  children,
  className,
  y = 34,
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
}) {
  const ref = useGsapReveal<HTMLDivElement>({ y, duration: 0.85, ease: "power3.out" });
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

function AutoScrollRail<T>({
  items,
  renderItem,
  direction = "forward",
  durationSeconds = 30,
  reduceMotion,
}: {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  direction?: "forward" | "reverse";
  durationSeconds?: number;
  reduceMotion: boolean;
}) {
  if (!items.length) return null;

  if (reduceMotion) {
    return <div className="flex flex-wrap gap-3">{items.map((item, index) => renderItem(item, index))}</div>;
  }

  const repeatedItems = [...items, ...items];

  return (
    <div className="auto-carousel-mask overflow-hidden py-1">
      <div
        className={`auto-carousel-track flex w-max gap-4 ${direction === "reverse" ? "auto-carousel-track-reverse" : ""}`}
        style={{ "--scroll-duration": `${durationSeconds}s` } as React.CSSProperties}
      >
        {repeatedItems.map((item, index) => (
          <div key={index} aria-hidden={index >= items.length}>
            {renderItem(item, index % items.length)}
          </div>
        ))}
      </div>
    </div>
  );
}

function TechToken({
  label,
  note,
  compact = false,
}: {
  label: string;
  note?: string;
  compact?: boolean;
}) {
  const visual = getTechVisual(label);
  const Icon = visual.icon;

  return (
    <div
      className={`rounded-[1.35rem] border border-white/10 bg-[#081321]/90 ${
        compact ? "min-w-[170px] px-3 py-3" : "min-w-[220px] px-4 py-4"
      } shadow-[0_16px_40px_rgba(0,0,0,0.22)] transition hover:border-primary/30 hover:bg-[#0b1829]`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex ${compact ? "h-9 w-9 rounded-2xl" : "h-11 w-11 rounded-[1.15rem]"} items-center justify-center ${visual.shellClassName}`}
        >
          {visual.imageSrc ? (
            <Image
              src={visual.imageSrc}
              alt=""
              aria-hidden="true"
              width={compact ? 18 : 22}
              height={compact ? 18 : 22}
              className="h-auto w-auto"
            />
          ) : Icon ? (
            <Icon className={`${compact ? "h-4 w-4" : "h-5 w-5"} ${visual.iconClassName}`} />
          ) : null}
        </div>

        <div className="min-w-0">
          {note ? <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{note}</p> : null}
          <p className={`${compact ? "text-sm" : "text-base"} truncate font-semibold text-white`}>{label}</p>
        </div>
      </div>
    </div>
  );
}

function RepoCarouselCard({
  project,
}: {
  project: {
    name: string;
    url: string;
  };
}) {
  return (
    <Link
      href={project.url}
      target="_blank"
      rel="noreferrer"
      className="group flex min-w-[250px] items-center justify-between gap-4 rounded-[1.4rem] border border-white/10 bg-[#081321]/90 px-4 py-4 shadow-[0_16px_40px_rgba(0,0,0,0.22)] transition hover:border-primary/35 hover:bg-[#0b1829]"
    >
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Open source repo</p>
        <h3 className="mt-1 text-sm font-semibold text-white">{project.name}</h3>
      </div>

      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-primary transition group-hover:border-primary/30 group-hover:bg-primary/10">
        <Github className="h-4 w-4" />
      </div>
    </Link>
  );
}

function ProjectCard({ project, reduceMotion }: { project: ProjectDoc; reduceMotion: boolean }) {
  const cardRef = useRef<HTMLElement | null>(null);
  const stackLabels = useMemo(() => getProjectStacks(project), [project]);
  const revealRef = useGsapReveal<HTMLElement>({
    y: 44,
    duration: 0.95,
    ease: "power3.out",
  });

  useEffect(() => {
    const node = cardRef.current;
    if (!node || reduceMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        node,
        { opacity: 0.78, scale: 0.975 },
        {
          opacity: 1,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: node,
            start: "top 92%",
            end: "top 36%",
            scrub: true,
          },
        },
      );
    }, node);

    const rotateXTo = gsap.quickTo(node, "rotateX", { duration: 0.24, ease: "power2.out" });
    const rotateYTo = gsap.quickTo(node, "rotateY", { duration: 0.24, ease: "power2.out" });
    const yTo = gsap.quickTo(node, "y", { duration: 0.24, ease: "power2.out" });

    const onMove = (event: MouseEvent) => {
      const rect = node.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      rotateXTo(-y * 5.5);
      rotateYTo(x * 8);
      yTo(-4);
    };

    const onLeave = () => {
      rotateXTo(0);
      rotateYTo(0);
      yTo(0);
    };

    node.addEventListener("mousemove", onMove);
    node.addEventListener("mouseleave", onLeave);

    return () => {
      node.removeEventListener("mousemove", onMove);
      node.removeEventListener("mouseleave", onLeave);
      ctx.revert();
    };
  }, [reduceMotion]);

  const imageSrc = getImageUrl(project.imageId, project.heroImageUrl || "/placeholder.svg");

  return (
    <article
      ref={(node) => {
        cardRef.current = node;
        revealRef.current = node;
      }}
      className="project-card surface-card relative flex h-full transform-gpu flex-col overflow-hidden border-white/10 bg-[linear-gradient(180deg,rgba(8,16,29,0.95)_0%,rgba(10,18,29,0.82)_100%)] p-4 sm:p-5"
      style={{ transformStyle: "preserve-3d", willChange: reduceMotion ? "auto" : "transform" }}
    >
      <div className="relative mb-4 h-44 overflow-hidden rounded-2xl border border-white/10">
        <Image
          src={imageSrc}
          alt={`${project.name} preview`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-white">{project.name}</h3>
        {project.featured ? (
          <span className="chip border-secondary/30 bg-secondary/15 text-secondary">Featured</span>
        ) : null}
      </div>

      <p className="mb-4 text-sm leading-relaxed text-slate-300">
        {project.description || "Project details available in admin content."}
      </p>

      {stackLabels.length ? (
        <div className="mb-5">
          <p className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">
            <Wrench className="h-3.5 w-3.5" />
            Stack carousel
          </p>
          <AutoScrollRail
            items={stackLabels}
            renderItem={(stack) => <TechToken label={stack} compact />}
            durationSeconds={stackLabels.length > 4 ? 18 : 24}
            reduceMotion={reduceMotion}
          />
        </div>
      ) : null}

      <div className="mt-auto flex items-center gap-4">
        {project.githubUrl ? (
          <Link
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            <Github className="h-4 w-4" />
            Source
          </Link>
        ) : (
          <span className="text-sm text-slate-400">Repo pending</span>
        )}

        {project.homepage ? (
          <Link
            href={project.homepage}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-slate-200 hover:underline"
          >
            <ExternalLink className="h-4 w-4" />
            Live
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
  const reduceMotion = usePrefersReducedMotion();
  const navItems = data.content.presentation.navigation;

  const [menuOpen, setMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  const featuredProjects = useMemo(() => data.projects.filter((project) => project.featured), [data.projects]);

  const stellarProjects = useMemo(() => {
    const lookup = new Map(data.projects.map((project) => [project.name.toLowerCase(), project]));

    return data.content.stellarSection.projectNames.map((name) => ({
      name,
      url: lookup.get(name.toLowerCase())?.githubUrl || stellarContributionRepoUrls[name] || "",
    }));
  }, [data.content.stellarSection.projectNames, data.projects]);

  const [primarySkillRow, secondarySkillRow] = useMemo(() => splitForRows(data.skills), [data.skills]);
  const [primaryStellarRow, secondaryStellarRow] = useMemo(
    () => splitForRows(stellarProjects.filter((project) => project.url)),
    [stellarProjects],
  );

  useEffect(() => {
    const panel = mobileMenuRef.current;
    if (!panel) return;

    if (reduceMotion) {
      panel.style.display = menuOpen ? "block" : "none";
      return;
    }

    if (menuOpen) {
      gsap.set(panel, { display: "block" });
      gsap.fromTo(panel, { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" });
      gsap.fromTo(
        panel.querySelectorAll("[data-mobile-item]"),
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.24, stagger: 0.04, delay: 0.06, ease: "power2.out" },
      );
    } else {
      gsap.to(panel, {
        autoAlpha: 0,
        y: -10,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(panel, { display: "none" });
        },
      });
    }
  }, [menuOpen, reduceMotion]);

  return (
    <div className="relative overflow-x-clip pb-20">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_8%,rgba(72,154,221,0.18),transparent_34%),radial-gradient(circle_at_88%_14%,rgba(252,175,101,0.18),transparent_28%),radial-gradient(circle_at_55%_45%,rgba(50,83,122,0.14),transparent_38%)]" />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050b14]/75 backdrop-blur-xl">
        <div className="section-shell flex h-[74px] items-center justify-between">
          <Link href="#hero" className="font-display text-lg font-semibold tracking-tight text-white sm:text-xl">
            {data.content.presentation.brandName}
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={`#${item.id}`}
                className="text-sm font-medium text-slate-300 transition hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            aria-label="Toggle navigation"
            className="inline-flex rounded-lg border border-white/15 p-2 text-slate-200 transition hover:border-white/30 hover:text-white lg:hidden"
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <div ref={mobileMenuRef} className="hidden border-t border-white/10 bg-[#07101c]/95 lg:hidden">
          <nav className="section-shell grid gap-3 py-5">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={`#${item.id}`}
                data-mobile-item
                className="rounded-lg px-2 py-1 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <Hero content={data.content} />

        <section id="about" className="section-shell py-12 lg:py-16">
          <Reveal>
            <SectionHeading
              title={data.content.about.title}
              subtitle={data.content.about.label}
            />
            <div className="surface-card grid gap-7 border-white/10 bg-white/5 p-6 text-slate-200 lg:grid-cols-2 lg:p-9">
              <p className="text-base leading-relaxed text-slate-300">{data.content.about.summary}</p>
              <p className="text-base leading-relaxed text-slate-300">{data.content.about.body}</p>
            </div>
          </Reveal>
        </section>

        <section id="skills" className="section-shell py-12 lg:py-16">
          <Reveal>
            <SectionHeading
              title={data.content.presentation.skills.title}
              subtitle={data.content.presentation.skills.label}
              accent={data.content.presentation.skills.accent}
            />
          </Reveal>
          <Reveal>
            <div className="surface-card border-white/10 bg-white/5 p-4 sm:p-6">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-2xl text-sm leading-relaxed text-slate-300">
                  {data.content.presentation.skills.accent}
                </p>
                <span className="chip w-fit border-white/15 bg-white/8 text-slate-100">Moving stack carousel</span>
              </div>

              <div className="space-y-4">
                <AutoScrollRail
                  items={primarySkillRow}
                  renderItem={(skill) => <TechToken label={skill.name} note={skill.category} />}
                  durationSeconds={34}
                  reduceMotion={reduceMotion}
                />
                <AutoScrollRail
                  items={secondarySkillRow.length ? secondarySkillRow : primarySkillRow}
                  renderItem={(skill) => <TechToken label={skill.name} note={skill.category} />}
                  direction="reverse"
                  durationSeconds={38}
                  reduceMotion={reduceMotion}
                />
              </div>
            </div>
          </Reveal>
        </section>

        <section id="stellar" className="section-shell py-12 lg:py-16">
          <Reveal>
            <SectionHeading
              title={data.content.stellarSection.title}
              subtitle={data.content.stellarSection.label}
              accent={data.content.stellarSection.accent}
            />

            <div className="surface-card border-white/10 bg-white/5 p-6 lg:p-8">
              <p className="mb-3 text-base leading-relaxed text-slate-300">{data.content.stellarSection.intro}</p>
              <p className="mb-7 text-base font-medium text-slate-100">{data.content.stellarSection.contribution}</p>

              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-2 text-sm text-slate-400">
                  <Blocks className="h-4 w-4 text-primary" />
                  Continuous repo rails with direct links to each contribution.
                </p>
                <span className="chip w-fit border-white/15 bg-white/8 text-slate-100">
                  {stellarProjects.filter((project) => project.url).length} linked repositories
                </span>
              </div>

              <div className="space-y-4">
                <AutoScrollRail
                  items={primaryStellarRow}
                  renderItem={(project) => <RepoCarouselCard project={project} />}
                  durationSeconds={42}
                  reduceMotion={reduceMotion}
                />
                <AutoScrollRail
                  items={secondaryStellarRow.length ? secondaryStellarRow : primaryStellarRow}
                  renderItem={(project) => <RepoCarouselCard project={project} />}
                  direction="reverse"
                  durationSeconds={48}
                  reduceMotion={reduceMotion}
                />
              </div>
            </div>
          </Reveal>
        </section>

        <section id="projects" className="section-shell py-12 lg:py-16">
          <Reveal>
            <SectionHeading
              title={data.content.presentation.projects.title}
              subtitle={data.content.presentation.projects.label}
              accent={data.content.presentation.projects.accent}
            />
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project._id || project.name} project={project} reduceMotion={reduceMotion} />
            ))}
          </div>
        </section>

        <section id="credibility" className="section-shell py-12 lg:py-16">
          <Reveal>
            <SectionHeading
              title={data.content.presentation.credibility.title}
              subtitle={data.content.presentation.credibility.label}
              accent={data.content.presentation.credibility.accent}
            />
          </Reveal>

          <Reveal>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              <article className="surface-card border-white/10 bg-white/5 p-5">
                <p className="text-xs text-slate-400">Public repos</p>
                <p className="mt-3 flex items-center gap-2 text-2xl font-semibold text-white">
                  <Rocket className="h-5 w-5 text-primary" />
                  {githubStats.publicRepos}
                </p>
              </article>
              <article className="surface-card border-white/10 bg-white/5 p-5">
                <p className="text-xs text-slate-400">Followers</p>
                <p className="mt-3 flex items-center gap-2 text-2xl font-semibold text-white">
                  <Users className="h-5 w-5 text-primary" />
                  {githubStats.followers}
                </p>
              </article>
              <article className="surface-card border-white/10 bg-white/5 p-5">
                <p className="text-xs text-slate-400">Stars received</p>
                <p className="mt-3 flex items-center gap-2 text-2xl font-semibold text-white">
                  <Star className="h-5 w-5 text-primary" />
                  {githubStats.totalStars}
                </p>
              </article>
              <article className="surface-card border-white/10 bg-white/5 p-5">
                <p className="text-xs text-slate-400">Commits (365d, approx)</p>
                <p className="mt-3 flex items-center gap-2 text-2xl font-semibold text-white">
                  <LineChart className="h-5 w-5 text-primary" />
                  {githubStats.approxCommitsLastYear}
                </p>
              </article>
              <article className="surface-card border-white/10 bg-white/5 p-5">
                <p className="text-xs text-slate-400">Merged PRs (365d)</p>
                <p className="mt-3 flex items-center gap-2 text-2xl font-semibold text-white">
                  <Github className="h-5 w-5 text-primary" />
                  {githubStats.mergedPrsLastYear}
                </p>
              </article>
              <article className="surface-card border-white/10 bg-white/5 p-5">
                <p className="text-xs text-slate-400">Contributions (365d)</p>
                <p className="mt-3 flex items-center gap-2 text-2xl font-semibold text-white">
                  <Github className="h-5 w-5 text-primary" />
                  {githubStats.contributionsLastYear || "N/A"}
                </p>
              </article>
            </div>

            <p className="mt-5 text-sm text-slate-400">
              Activity summary: {githubStats.activitySummary.pushEvents} push events, {" "}
              {githubStats.activitySummary.pullRequests} PR events, {githubStats.activitySummary.issues} issues, {" "}
              {githubStats.activitySummary.starsGiven} stars given. Source: {githubStats.source}.
            </p>
          </Reveal>
        </section>

        <section id="experience" className="section-shell py-12 lg:py-16">
          <Reveal>
            <SectionHeading
              title={data.content.presentation.experience.title}
              subtitle={data.content.presentation.experience.label}
              accent={data.content.presentation.experience.accent}
            />
            <div className="space-y-4">
              {data.content.experience.map((item) => (
                <article key={`${item.company}-${item.period}`} className="surface-card border-white/10 bg-white/5 p-6">
                  <div className="mb-3 flex flex-wrap items-center gap-3 text-sm">
                    <span className="chip border-white/20 bg-white/8 text-slate-100">
                      <BriefcaseBusiness className="mr-1.5 h-3.5 w-3.5" />
                      {item.role}
                    </span>
                    <span className="chip border-white/20 bg-white/8 text-slate-100">{item.period}</span>
                    <span className="chip border-white/20 bg-white/8 text-slate-100">{item.location}</span>
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-white">{item.company}</h3>
                  <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-300">
                    {item.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </Reveal>
        </section>

        <section className="section-shell py-12 lg:py-16">
          <Reveal>
            <SectionHeading
              title={data.content.presentation.education.title}
              subtitle={data.content.presentation.education.label}
              accent={data.content.presentation.education.accent}
            />
            <div className="grid gap-4 lg:grid-cols-3">
              {data.content.education.map((item) => (
                <article key={`${item.school}-${item.period}`} className="surface-card border-white/10 bg-white/5 p-5">
                  <p className="chip border-white/20 bg-white/8 text-slate-100">
                    <GraduationCap className="mr-1.5 h-3.5 w-3.5" />
                    {item.period}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold text-white">{item.degree}</h3>
                  <p className="mt-2 text-sm text-slate-300">{item.school}</p>
                  <p className="mt-1 text-sm text-slate-400">{item.details}</p>
                </article>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="awards" className="section-shell py-12 lg:py-16">
          <Reveal>
            <SectionHeading
              title={data.content.presentation.awards.title}
              subtitle={data.content.presentation.awards.label}
              accent={data.content.presentation.awards.accent}
            />
          </Reveal>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.awards.map((award) => (
              <Reveal key={award._id || `${award.title}-${award.year}`} y={26}>
                <article className="surface-card h-full border-white/10 bg-white/5 p-5">
                  {award.imageId ? (
                    <div className="relative mb-4 h-40 overflow-hidden rounded-xl border border-white/10">
                      <Image
                        src={getImageUrl(award.imageId, "/placeholder.svg")}
                        alt={award.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <p className="chip w-fit border-secondary/30 bg-secondary/15 text-secondary">{award.year}</p>
                  <h3 className="mt-3 text-lg font-semibold text-white">{award.title}</h3>
                  <p className="mt-2 text-sm text-slate-300">{award.orgOrEvent}</p>
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
                      className="mt-4 inline-flex items-center gap-1 text-sm text-slate-200 hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View proof
                    </Link>
                  ) : null}
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="contact" className="section-shell py-12 lg:py-16">
          <Reveal>
            <SectionHeading
              title={data.content.contact.title}
              subtitle={data.content.contact.label}
            />

            <div className="surface-card grid gap-6 border-white/10 bg-white/5 p-6 lg:grid-cols-2 lg:p-8">
              <div>
                <p className="mb-4 text-sm leading-relaxed text-slate-300 sm:text-base">
                  {data.content.contact.intro}
                </p>
                <div className="space-y-2 text-sm text-slate-200">
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
                <Link href={data.content.socials.github} target="_blank" rel="noreferrer" className="chip w-fit border-white/20 bg-white/8 text-slate-100 hover:bg-white/15">
                  GitHub
                </Link>
                <Link href={data.content.socials.linkedin} target="_blank" rel="noreferrer" className="chip w-fit border-white/20 bg-white/8 text-slate-100 hover:bg-white/15">
                  LinkedIn
                </Link>
                <Link href={data.content.socials.x} target="_blank" rel="noreferrer" className="chip w-fit border-white/20 bg-white/8 text-slate-100 hover:bg-white/15">
                  X
                </Link>
                <Link href={data.content.resumeHighlights.resumeUrl} className="chip w-fit border-white/20 bg-white/8 text-slate-100 hover:bg-white/15">
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
