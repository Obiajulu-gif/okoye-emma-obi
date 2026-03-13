export interface SocialLinks {
  github: string;
  linkedin: string;
  x: string;
  email: string;
  website: string;
}

export interface HeroContent {
  eyebrow: string;
  name: string;
  roles: string[];
  description: string;
  primaryCtaLabel: string;
  primaryCtaUrl: string;
  secondaryCtaLabel: string;
  secondaryCtaUrl: string;
  heroImageId?: string;
  heroImageFallback?: string;
}

export interface AboutContent {
  label: string;
  title: string;
  summary: string;
  body: string;
}

export interface ContactContent {
  label: string;
  title: string;
  intro: string;
  email: string;
  phone: string;
  location: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  location: string;
  highlights: string[];
}

export interface EducationItem {
  school: string;
  degree: string;
  period: string;
  details: string;
}

export interface ResumeHighlights {
  selectedProjects: string[];
  awards: string[];
  coreSkills: string[];
  resumeUrl: string;
}

export interface StellarSection {
  label: string;
  title: string;
  intro: string;
  contribution: string;
  accent: string;
  projectNames: string[];
}

export interface NavigationItem {
  id: string;
  label: string;
}

export interface SectionCopy {
  label: string;
  title: string;
  accent?: string;
}

export interface SitePresentation {
  brandName: string;
  navigation: NavigationItem[];
  skills: SectionCopy;
  projects: SectionCopy;
  credibility: SectionCopy;
  experience: SectionCopy;
  education: SectionCopy;
  awards: SectionCopy;
}

export interface SiteContentDoc {
  _id?: string;
  singletonKey: "main";
  hero: HeroContent;
  about: AboutContent;
  socials: SocialLinks;
  contact: ContactContent;
  stellarSection: StellarSection;
  presentation: SitePresentation;
  experience: ExperienceItem[];
  education: EducationItem[];
  resumeHighlights: ResumeHighlights;
  updatedAt: string;
}

export interface SkillDoc {
  _id?: string;
  name: string;
  category: string;
  level?: string;
  order: number;
  updatedAt?: string;
}

export interface ProjectAutoMetadata {
  githubUrl?: string;
  description?: string;
  tags?: string[];
  languages?: string[];
  homepage?: string;
  heroImageUrl?: string;
  fetchedAt?: string;
}

export interface ProjectOverrides {
  githubUrl?: string;
  description?: string;
  tags?: string[];
  heroImageId?: string;
  homepage?: string;
}

export interface ProjectDoc {
  _id?: string;
  name: string;
  order: number;
  featured: boolean;
  githubUrl?: string;
  description?: string;
  tags: string[];
  languages?: string[];
  homepage?: string;
  imageId?: string;
  heroImageUrl?: string;
  needsRepo?: boolean;
  needsImage?: boolean;
  autoMetadata?: ProjectAutoMetadata;
  overrides?: ProjectOverrides;
  updatedAt: string;
}

export interface AwardDoc {
  _id?: string;
  title: string;
  orgOrEvent: string;
  year: number;
  placement?: string;
  order: number;
  proofUrl?: string;
  imageId?: string;
  needsImage?: boolean;
  updatedAt: string;
}

export interface ImageDoc {
  _id?: string;
  fileId: string;
  filename: string;
  contentType: string;
  size: number;
  alt?: string;
  sourceUrl?: string;
  createdAt: string;
}

export interface GitHubCredibilityStats {
  username: string;
  publicRepos: number;
  followers: number;
  totalStars: number;
  approxCommitsLastYear: number;
  mergedPrsLastYear: number;
  contributionsLastYear?: number;
  activitySummary: {
    pushEvents: number;
    pullRequests: number;
    issues: number;
    starsGiven: number;
  };
  source: "graphql" | "rest" | "fallback";
  updatedAt: string;
}

export interface PortfolioData {
  content: SiteContentDoc;
  skills: SkillDoc[];
  projects: ProjectDoc[];
  awards: AwardDoc[];
}
