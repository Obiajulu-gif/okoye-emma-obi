"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, LogOut, RefreshCw, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { AwardDoc, ImageDoc, ProjectDoc, SiteContentDoc, SkillDoc } from "@/types/portfolio";

const contentSchema = z.object({
  brandName: z.string().min(1),
  navigationJson: z.string().min(2),
  heroName: z.string().min(1),
  heroEyebrow: z.string().min(1),
  heroRolesCsv: z.string().min(1),
  heroDescription: z.string().min(1),
  primaryCtaLabel: z.string().min(1),
  primaryCtaUrl: z.string().min(1),
  secondaryCtaLabel: z.string().min(1),
  secondaryCtaUrl: z.string().min(1),
  heroImageId: z.string().optional(),
  aboutLabel: z.string().min(1),
  aboutTitle: z.string().min(1),
  aboutSummary: z.string().min(1),
  aboutBody: z.string().min(1),
  skillsLabel: z.string().min(1),
  skillsTitle: z.string().min(1),
  skillsAccent: z.string().min(1),
  projectsLabel: z.string().min(1),
  projectsTitle: z.string().min(1),
  projectsAccent: z.string().min(1),
  credibilityLabel: z.string().min(1),
  credibilityTitle: z.string().min(1),
  credibilityAccent: z.string().optional(),
  experienceLabel: z.string().min(1),
  experienceTitle: z.string().min(1),
  educationLabel: z.string().min(1),
  educationTitle: z.string().min(1),
  awardsLabel: z.string().min(1),
  awardsTitle: z.string().min(1),
  github: z.string().min(1),
  linkedin: z.string().min(1),
  x: z.string().min(1),
  emailLink: z.string().min(1),
  website: z.string().min(1),
  contactLabel: z.string().min(1),
  contactTitle: z.string().min(1),
  contactIntro: z.string().min(1),
  contactEmail: z.string().min(1),
  contactPhone: z.string().min(1),
  contactLocation: z.string().min(1),
  stellarLabel: z.string().min(1),
  stellarTitle: z.string().min(1),
  stellarIntro: z.string().min(1),
  stellarContribution: z.string().min(1),
  stellarAccent: z.string().min(1),
  stellarProjectsCsv: z.string().min(1),
  experienceJson: z.string().min(2),
  educationJson: z.string().min(2),
  selectedProjectsCsv: z.string().optional(),
  awardsCsv: z.string().optional(),
  coreSkillsCsv: z.string().optional(),
  resumeUrl: z.string().min(1),
});

const skillSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  level: z.string().optional(),
  order: z.coerce.number().int(),
});

const projectSchema = z.object({
  name: z.string().min(1),
  order: z.coerce.number().int(),
  featured: z.boolean().default(false),
  overrideGithubUrl: z.string().optional(),
  overrideDescription: z.string().optional(),
  overrideTagsCsv: z.string().optional(),
  overrideHomepage: z.string().optional(),
  overrideHeroImageId: z.string().optional(),
});

const awardSchema = z.object({
  title: z.string().min(1),
  orgOrEvent: z.string().min(1),
  year: z.coerce.number().int(),
  placement: z.string().optional(),
  order: z.coerce.number().int(),
  proofUrl: z.string().optional(),
  imageId: z.string().optional(),
});

const mediaSchema = z.object({
  alt: z.string().optional(),
});

function commaStringToArray(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function mapContentToForm(content: SiteContentDoc) {
  return {
    brandName: content.presentation.brandName,
    navigationJson: JSON.stringify(content.presentation.navigation, null, 2),
    heroName: content.hero.name,
    heroEyebrow: content.hero.eyebrow,
    heroRolesCsv: content.hero.roles.join(", "),
    heroDescription: content.hero.description,
    primaryCtaLabel: content.hero.primaryCtaLabel,
    primaryCtaUrl: content.hero.primaryCtaUrl,
    secondaryCtaLabel: content.hero.secondaryCtaLabel,
    secondaryCtaUrl: content.hero.secondaryCtaUrl,
    heroImageId: content.hero.heroImageId || "",
    aboutLabel: content.about.label,
    aboutTitle: content.about.title,
    aboutSummary: content.about.summary,
    aboutBody: content.about.body,
    skillsLabel: content.presentation.skills.label,
    skillsTitle: content.presentation.skills.title,
    skillsAccent: content.presentation.skills.accent || "",
    projectsLabel: content.presentation.projects.label,
    projectsTitle: content.presentation.projects.title,
    projectsAccent: content.presentation.projects.accent || "",
    credibilityLabel: content.presentation.credibility.label,
    credibilityTitle: content.presentation.credibility.title,
    credibilityAccent: content.presentation.credibility.accent || "",
    experienceLabel: content.presentation.experience.label,
    experienceTitle: content.presentation.experience.title,
    educationLabel: content.presentation.education.label,
    educationTitle: content.presentation.education.title,
    awardsLabel: content.presentation.awards.label,
    awardsTitle: content.presentation.awards.title,
    github: content.socials.github,
    linkedin: content.socials.linkedin,
    x: content.socials.x,
    emailLink: content.socials.email,
    website: content.socials.website,
    contactLabel: content.contact.label,
    contactTitle: content.contact.title,
    contactIntro: content.contact.intro,
    contactEmail: content.contact.email,
    contactPhone: content.contact.phone,
    contactLocation: content.contact.location,
    stellarLabel: content.stellarSection.label,
    stellarTitle: content.stellarSection.title,
    stellarIntro: content.stellarSection.intro,
    stellarContribution: content.stellarSection.contribution,
    stellarAccent: content.stellarSection.accent,
    stellarProjectsCsv: content.stellarSection.projectNames.join(", "),
    experienceJson: JSON.stringify(content.experience, null, 2),
    educationJson: JSON.stringify(content.education, null, 2),
    selectedProjectsCsv: content.resumeHighlights.selectedProjects.join(", "),
    awardsCsv: content.resumeHighlights.awards.join(", "),
    coreSkillsCsv: content.resumeHighlights.coreSkills.join(", "),
    resumeUrl: content.resumeHighlights.resumeUrl,
  };
}

function mediaUrl(id?: string) {
  return id ? `/api/media/${id}` : "/placeholder.svg";
}

function ImageSelect({
  id,
  label,
  value,
  onChange,
  images,
}: {
  id: string;
  label: string;
  value?: string;
  onChange: (value: string) => void;
  images: ImageDoc[];
}) {
  const selected = images.find((image) => image._id === value);

  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
      >
        <option value="">No image selected</option>
        {images.map((image) => (
          <option key={image._id || image.fileId} value={image._id || ""}>
            {image.filename}
          </option>
        ))}
      </select>
      {selected?._id ? (
        <img
          src={mediaUrl(selected._id)}
          alt={selected.alt || selected.filename}
          className="h-24 w-24 rounded-md border border-border object-cover"
        />
      ) : null}
    </div>
  );
}

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error || `Request failed (${res.status})`);
  }

  return (await res.json()) as T;
}

export function AdminDashboardClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [savingContent, setSavingContent] = useState(false);
  const [syncingDefaults, setSyncingDefaults] = useState(false);
  const [syncingProjects, setSyncingProjects] = useState(false);
  const [skills, setSkills] = useState<SkillDoc[]>([]);
  const [projects, setProjects] = useState<ProjectDoc[]>([]);
  const [awards, setAwards] = useState<AwardDoc[]>([]);
  const [images, setImages] = useState<ImageDoc[]>([]);
  const [selectedSkillId, setSelectedSkillId] = useState<string>("");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [selectedAwardId, setSelectedAwardId] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const contentForm = useForm<z.infer<typeof contentSchema>>({
    resolver: zodResolver(contentSchema),
  });

  const createSkillForm = useForm<z.infer<typeof skillSchema>>({
    resolver: zodResolver(skillSchema),
    defaultValues: { name: "", category: "", level: "", order: 1 },
  });

  const editSkillForm = useForm<z.infer<typeof skillSchema>>({
    resolver: zodResolver(skillSchema),
    defaultValues: { name: "", category: "", level: "", order: 1 },
  });

  const createProjectForm = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      order: 1,
      featured: false,
      overrideDescription: "",
      overrideGithubUrl: "",
      overrideTagsCsv: "",
      overrideHomepage: "",
      overrideHeroImageId: "",
    },
  });

  const editProjectForm = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      order: 1,
      featured: false,
      overrideDescription: "",
      overrideGithubUrl: "",
      overrideTagsCsv: "",
      overrideHomepage: "",
      overrideHeroImageId: "",
    },
  });

  const createAwardForm = useForm<z.infer<typeof awardSchema>>({
    resolver: zodResolver(awardSchema),
    defaultValues: {
      title: "",
      orgOrEvent: "",
      year: new Date().getFullYear(),
      placement: "",
      order: 1,
      proofUrl: "",
      imageId: "",
    },
  });

  const editAwardForm = useForm<z.infer<typeof awardSchema>>({
    resolver: zodResolver(awardSchema),
    defaultValues: {
      title: "",
      orgOrEvent: "",
      year: new Date().getFullYear(),
      placement: "",
      order: 1,
      proofUrl: "",
      imageId: "",
    },
  });

  const mediaForm = useForm<z.infer<typeof mediaSchema>>({
    resolver: zodResolver(mediaSchema),
    defaultValues: { alt: "" },
  });

  const selectedProject = useMemo(
    () => projects.find((project) => project._id === selectedProjectId),
    [projects, selectedProjectId],
  );

  const selectedSkill = useMemo(
    () => skills.find((skill) => skill._id === selectedSkillId),
    [skills, selectedSkillId],
  );

  const selectedAward = useMemo(
    () => awards.find((award) => award._id === selectedAwardId),
    [awards, selectedAwardId],
  );

  const sortedImages = useMemo(
    () => [...images].sort((a, b) => (a.filename || "").localeCompare(b.filename || "")),
    [images],
  );

  const mergeResolvedProjects = (updated: ProjectDoc[]) => {
    if (!updated.length) return;
    const updatedById = new Map(updated.map((project) => [project._id, project]));
    setProjects((prev) =>
      prev
        .map((project) => updatedById.get(project._id) || project)
        .sort((a, b) => a.order - b.order),
    );
  };

  async function loadAll() {
    setLoading(true);
    try {
      const [content, skillsData, projectsData, awardsData, imagesData] = await Promise.all([
        apiFetch<SiteContentDoc>("/api/admin/content"),
        apiFetch<SkillDoc[]>("/api/admin/skills"),
        apiFetch<ProjectDoc[]>("/api/admin/projects"),
        apiFetch<AwardDoc[]>("/api/admin/awards"),
        apiFetch<ImageDoc[]>("/api/admin/media"),
      ]);

      contentForm.reset(mapContentToForm(content));
      setSkills(skillsData);
      setProjects(projectsData);
      setAwards(awardsData);
      setImages(imagesData);

      if (skillsData[0]?._id) setSelectedSkillId(skillsData[0]._id);
      if (projectsData[0]?._id) setSelectedProjectId(projectsData[0]._id);
      if (awardsData[0]?._id) setSelectedAwardId(awardsData[0]._id);

      const unresolvedCount = projectsData.filter(
        (project) => project.needsRepo || !project.autoMetadata?.fetchedAt,
      ).length;

      if (unresolvedCount > 0) {
        setSyncingProjects(true);
        void apiFetch<{ updatedCount: number; updated: ProjectDoc[] }>(
          "/api/admin/projects/resolve-missing",
          {
            method: "POST",
            body: JSON.stringify({ limit: 50 }),
          },
        )
          .then((response) => {
            mergeResolvedProjects(response.updated);
            if (response.updatedCount > 0) {
              toast.success(`Auto-resolved metadata for ${response.updatedCount} projects.`);
            }
          })
          .catch(() => {
            // Keep dashboard usable even when GitHub metadata fetch fails.
          })
          .finally(() => setSyncingProjects(false));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load admin data";
      toast.error(message);
      if (message.toLowerCase().includes("unauthorized")) {
        router.push("/admin");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedSkill) return;
    editSkillForm.reset({
      name: selectedSkill.name,
      category: selectedSkill.category,
      level: selectedSkill.level || "",
      order: selectedSkill.order,
    });
  }, [selectedSkill, editSkillForm]);

  useEffect(() => {
    if (!selectedProject) return;
    editProjectForm.reset({
      name: selectedProject.name,
      order: selectedProject.order,
      featured: selectedProject.featured,
      overrideGithubUrl: selectedProject.overrides?.githubUrl || "",
      overrideDescription: selectedProject.overrides?.description || "",
      overrideTagsCsv: (selectedProject.overrides?.tags || []).join(", "),
      overrideHomepage: selectedProject.overrides?.homepage || "",
      overrideHeroImageId: selectedProject.overrides?.heroImageId || selectedProject.imageId || "",
    });
  }, [selectedProject, editProjectForm]);

  useEffect(() => {
    if (!selectedAward) return;
    editAwardForm.reset({
      title: selectedAward.title,
      orgOrEvent: selectedAward.orgOrEvent,
      year: selectedAward.year,
      placement: selectedAward.placement || "",
      order: selectedAward.order,
      proofUrl: selectedAward.proofUrl || "",
      imageId: selectedAward.imageId || "",
    });
  }, [selectedAward, editAwardForm]);

  const handleSaveContent = contentForm.handleSubmit(async (values) => {
    setSavingContent(true);
    try {
      const navigation = JSON.parse(values.navigationJson);
      const experience = JSON.parse(values.experienceJson);
      const education = JSON.parse(values.educationJson);

      await apiFetch("/api/admin/content", {
        method: "PUT",
        body: JSON.stringify({
          hero: {
            name: values.heroName,
            eyebrow: values.heroEyebrow,
            roles: commaStringToArray(values.heroRolesCsv),
            description: values.heroDescription,
            primaryCtaLabel: values.primaryCtaLabel,
            primaryCtaUrl: values.primaryCtaUrl,
            secondaryCtaLabel: values.secondaryCtaLabel,
            secondaryCtaUrl: values.secondaryCtaUrl,
            heroImageId: values.heroImageId || undefined,
          },
          about: {
            label: values.aboutLabel,
            title: values.aboutTitle,
            summary: values.aboutSummary,
            body: values.aboutBody,
          },
          presentation: {
            brandName: values.brandName,
            navigation,
            skills: {
              label: values.skillsLabel,
              title: values.skillsTitle,
              accent: values.skillsAccent,
            },
            projects: {
              label: values.projectsLabel,
              title: values.projectsTitle,
              accent: values.projectsAccent,
            },
            credibility: {
              label: values.credibilityLabel,
              title: values.credibilityTitle,
              accent: values.credibilityAccent,
            },
            experience: {
              label: values.experienceLabel,
              title: values.experienceTitle,
            },
            education: {
              label: values.educationLabel,
              title: values.educationTitle,
            },
            awards: {
              label: values.awardsLabel,
              title: values.awardsTitle,
            },
          },
          socials: {
            github: values.github,
            linkedin: values.linkedin,
            x: values.x,
            email: values.emailLink,
            website: values.website,
          },
          contact: {
            label: values.contactLabel,
            title: values.contactTitle,
            intro: values.contactIntro,
            email: values.contactEmail,
            phone: values.contactPhone,
            location: values.contactLocation,
          },
          stellarSection: {
            label: values.stellarLabel,
            title: values.stellarTitle,
            intro: values.stellarIntro,
            contribution: values.stellarContribution,
            accent: values.stellarAccent,
            projectNames: commaStringToArray(values.stellarProjectsCsv),
          },
          experience,
          education,
          resumeHighlights: {
            selectedProjects: commaStringToArray(values.selectedProjectsCsv || ""),
            awards: commaStringToArray(values.awardsCsv || ""),
            coreSkills: commaStringToArray(values.coreSkillsCsv || ""),
            resumeUrl: values.resumeUrl,
          },
        }),
      });

      toast.success("Content saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save content");
    } finally {
      setSavingContent(false);
    }
  });

  const handleSyncDefaults = async () => {
    setSyncingDefaults(true);
    try {
      const result = await apiFetch<{
        skillsCount: number;
        projectsCount: number;
        awardsCount: number;
      }>("/api/admin/content/sync", {
        method: "POST",
      });

      await loadAll();
      toast.success(
        `Synced frontend defaults to MongoDB (${result.skillsCount} skills, ${result.projectsCount} projects, ${result.awardsCount} awards).`,
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to sync frontend defaults");
    } finally {
      setSyncingDefaults(false);
    }
  };

  const handleCreateSkill = createSkillForm.handleSubmit(async (values) => {
    const optimistic: SkillDoc = {
      _id: `temp-${Date.now()}`,
      ...values,
      updatedAt: new Date().toISOString(),
    };

    setSkills((prev) => [...prev, optimistic].sort((a, b) => a.order - b.order));

    try {
      const created = await apiFetch<SkillDoc>("/api/admin/skills", {
        method: "POST",
        body: JSON.stringify(values),
      });

      setSkills((prev) =>
        prev
          .map((item) => (item._id === optimistic._id ? created : item))
          .sort((a, b) => a.order - b.order),
      );
      setSelectedSkillId(created._id || "");
      createSkillForm.reset({ name: "", category: "", level: "", order: values.order + 1 });
      toast.success("Skill added");
    } catch (error) {
      setSkills((prev) => prev.filter((item) => item._id !== optimistic._id));
      toast.error(error instanceof Error ? error.message : "Failed to create skill");
    }
  });

  const handleUpdateSkill = editSkillForm.handleSubmit(async (values) => {
    if (!selectedSkillId) return;
    const previous = skills;

    setSkills((prev) =>
      prev
        .map((item) => (item._id === selectedSkillId ? { ...item, ...values } : item))
        .sort((a, b) => a.order - b.order),
    );

    try {
      const updated = await apiFetch<SkillDoc>("/api/admin/skills", {
        method: "PUT",
        body: JSON.stringify({ id: selectedSkillId, ...values }),
      });
      setSkills((prev) =>
        prev
          .map((item) => (item._id === selectedSkillId ? updated : item))
          .sort((a, b) => a.order - b.order),
      );
      toast.success("Skill updated");
    } catch (error) {
      setSkills(previous);
      toast.error(error instanceof Error ? error.message : "Failed to update skill");
    }
  });

  const handleDeleteSkill = async () => {
    if (!selectedSkillId) return;
    const previous = skills;
    setSkills((prev) => prev.filter((item) => item._id !== selectedSkillId));

    try {
      await apiFetch(`/api/admin/skills?id=${selectedSkillId}`, { method: "DELETE" });
      setSelectedSkillId((current) =>
        current === selectedSkillId ? skills.find((item) => item._id !== selectedSkillId)?._id || "" : current,
      );
      toast.success("Skill removed");
    } catch (error) {
      setSkills(previous);
      toast.error(error instanceof Error ? error.message : "Failed to delete skill");
    }
  };

  const handleCreateProject = createProjectForm.handleSubmit(async (values) => {
    const payload = {
      name: values.name,
      order: values.order,
      featured: values.featured,
      githubUrl: "",
      description: "",
      tags: [],
      languages: [],
      homepage: "",
      needsRepo: true,
      needsImage: true,
      overrides: {
        githubUrl: values.overrideGithubUrl,
        description: values.overrideDescription,
        tags: commaStringToArray(values.overrideTagsCsv || ""),
        homepage: values.overrideHomepage,
        heroImageId: values.overrideHeroImageId,
      },
    };

    try {
      const created = await apiFetch<ProjectDoc>("/api/admin/projects", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setProjects((prev) => [...prev, created].sort((a, b) => a.order - b.order));
      setSelectedProjectId(created._id || "");
      toast.success("Project added");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create project");
    }
  });

  const handleUpdateProject = editProjectForm.handleSubmit(async (values) => {
    if (!selectedProjectId) return;

    try {
      const updated = await apiFetch<ProjectDoc>("/api/admin/projects", {
        method: "PUT",
        body: JSON.stringify({
          id: selectedProjectId,
          name: values.name,
          order: values.order,
          featured: values.featured,
          overrides: {
            githubUrl: values.overrideGithubUrl,
            description: values.overrideDescription,
            tags: commaStringToArray(values.overrideTagsCsv || ""),
            homepage: values.overrideHomepage,
            heroImageId: values.overrideHeroImageId,
          },
        }),
      });

      setProjects((prev) =>
        prev
          .map((item) => (item._id === selectedProjectId ? updated : item))
          .sort((a, b) => a.order - b.order),
      );
      toast.success("Project saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update project");
    }
  });

  const handleRefetchProject = async () => {
    if (!selectedProjectId) return;
    try {
      const updated = await apiFetch<ProjectDoc>("/api/admin/projects/refetch", {
        method: "POST",
        body: JSON.stringify({ id: selectedProjectId }),
      });

      setProjects((prev) =>
        prev.map((item) => (item._id === selectedProjectId ? updated : item)),
      );
      toast.success("GitHub metadata refreshed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to refresh metadata");
    }
  };

  const handleResolveMissingProjects = async () => {
    setSyncingProjects(true);
    try {
      const response = await apiFetch<{ updatedCount: number; updated: ProjectDoc[] }>(
        "/api/admin/projects/resolve-missing",
        {
          method: "POST",
          body: JSON.stringify({ limit: 50 }),
        },
      );

      if (response.updatedCount > 0) {
        mergeResolvedProjects(response.updated);
      }

      toast.success(
        response.updatedCount
          ? `Resolved metadata for ${response.updatedCount} project(s).`
          : "No unresolved projects found.",
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to resolve missing metadata");
    } finally {
      setSyncingProjects(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!selectedProjectId) return;

    try {
      await apiFetch(`/api/admin/projects?id=${selectedProjectId}`, { method: "DELETE" });
      const nextProjects = projects.filter((item) => item._id !== selectedProjectId);
      setProjects(nextProjects);
      setSelectedProjectId(nextProjects[0]?._id || "");
      toast.success("Project removed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete project");
    }
  };

  const handleCreateAward = createAwardForm.handleSubmit(async (values) => {
    try {
      const created = await apiFetch<AwardDoc>("/api/admin/awards", {
        method: "POST",
        body: JSON.stringify(values),
      });
      setAwards((prev) => [...prev, created].sort((a, b) => a.order - b.order));
      setSelectedAwardId(created._id || "");
      toast.success("Award added");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create award");
    }
  });

  const handleUpdateAward = editAwardForm.handleSubmit(async (values) => {
    if (!selectedAwardId) return;

    try {
      const updated = await apiFetch<AwardDoc>("/api/admin/awards", {
        method: "PUT",
        body: JSON.stringify({ id: selectedAwardId, ...values }),
      });
      setAwards((prev) =>
        prev
          .map((item) => (item._id === selectedAwardId ? updated : item))
          .sort((a, b) => a.order - b.order),
      );
      toast.success("Award saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update award");
    }
  });

  const handleDeleteAward = async () => {
    if (!selectedAwardId) return;

    try {
      await apiFetch(`/api/admin/awards?id=${selectedAwardId}`, { method: "DELETE" });
      const nextAwards = awards.filter((item) => item._id !== selectedAwardId);
      setAwards(nextAwards);
      setSelectedAwardId(nextAwards[0]?._id || "");
      toast.success("Award deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete award");
    }
  };

  const handleUploadMedia = mediaForm.handleSubmit(async (values) => {
    const fileInput = document.getElementById("media-file") as HTMLInputElement | null;
    const file = fileInput?.files?.[0];

    if (!file) {
      toast.error("Choose an image file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("alt", values.alt || "");

    setUploadingImage(true);

    try {
      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error || "Upload failed");
      }

      const image = (await res.json()) as ImageDoc;
      setImages((prev) => [image, ...prev]);
      mediaForm.reset({ alt: "" });
      if (fileInput) fileInput.value = "";
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploadingImage(false);
    }
  });

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  if (loading) {
    return (
      <main className="section-shell flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </main>
    );
  }

  return (
    <main className="section-shell py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Manage content, metadata, and media. Admin access remains restricted to this route.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled={syncingDefaults} onClick={handleSyncDefaults}>
            {syncingDefaults ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Sync Frontend Defaults
          </Button>
          <Button variant="outline" onClick={() => void loadAll()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content">
        <TabsList className="mb-6 grid w-full grid-cols-5">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="awards">Awards</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <Card>
            <CardHeader>
            <CardTitle>Core site content</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleSaveContent}>
              <div className="rounded border border-border p-4">
                <p className="mb-3 text-sm font-medium">Site chrome</p>
                <div className="grid gap-4">
                  <Input placeholder="Brand name" {...contentForm.register("brandName")} />
                  <Textarea
                    rows={8}
                    placeholder='Navigation JSON, e.g. [{"id":"about","label":"About"}]'
                    {...contentForm.register("navigationJson")}
                  />
                </div>
              </div>

              <div className="rounded border border-border p-4">
                <p className="mb-3 text-sm font-medium">Hero</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input placeholder="Hero Name" {...contentForm.register("heroName")} />
                  <Input placeholder="Hero Eyebrow" {...contentForm.register("heroEyebrow")} />
                </div>
                <Input placeholder="Hero Roles (comma-separated)" {...contentForm.register("heroRolesCsv")} />
                <Textarea placeholder="Hero Description" {...contentForm.register("heroDescription")} />
                <div className="grid gap-4 md:grid-cols-2">
                  <Input placeholder="Primary CTA Label" {...contentForm.register("primaryCtaLabel")} />
                  <Input placeholder="Primary CTA URL" {...contentForm.register("primaryCtaUrl")} />
                  <Input placeholder="Secondary CTA Label" {...contentForm.register("secondaryCtaLabel")} />
                  <Input placeholder="Secondary CTA URL" {...contentForm.register("secondaryCtaUrl")} />
                </div>
                <ImageSelect
                  id="hero-image-id"
                  label="Hero image"
                  value={contentForm.watch("heroImageId")}
                  onChange={(value) => contentForm.setValue("heroImageId", value)}
                  images={sortedImages}
                />
              </div>

              <div className="rounded border border-border p-4">
                <p className="mb-3 text-sm font-medium">About</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input placeholder="About label" {...contentForm.register("aboutLabel")} />
                  <Input placeholder="About title" {...contentForm.register("aboutTitle")} />
                </div>
                <Textarea placeholder="About summary" {...contentForm.register("aboutSummary")} />
                <Textarea placeholder="About body" {...contentForm.register("aboutBody")} />
              </div>

              <div className="rounded border border-border p-4">
                <p className="mb-3 text-sm font-medium">Section headings</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input placeholder="Skills label" {...contentForm.register("skillsLabel")} />
                  <Input placeholder="Skills title" {...contentForm.register("skillsTitle")} />
                  <Textarea placeholder="Skills accent" {...contentForm.register("skillsAccent")} />
                  <div />
                  <Input placeholder="Projects label" {...contentForm.register("projectsLabel")} />
                  <Input placeholder="Projects title" {...contentForm.register("projectsTitle")} />
                  <Textarea placeholder="Projects accent" {...contentForm.register("projectsAccent")} />
                  <div />
                  <Input placeholder="Credibility label" {...contentForm.register("credibilityLabel")} />
                  <Input placeholder="Credibility title" {...contentForm.register("credibilityTitle")} />
                  <Textarea placeholder="Credibility accent (optional)" {...contentForm.register("credibilityAccent")} />
                  <div />
                  <Input placeholder="Experience label" {...contentForm.register("experienceLabel")} />
                  <Input placeholder="Experience title" {...contentForm.register("experienceTitle")} />
                  <Input placeholder="Education label" {...contentForm.register("educationLabel")} />
                  <Input placeholder="Education title" {...contentForm.register("educationTitle")} />
                  <Input placeholder="Awards label" {...contentForm.register("awardsLabel")} />
                  <Input placeholder="Awards title" {...contentForm.register("awardsTitle")} />
                </div>
              </div>

              <div className="rounded border border-border p-4">
                <p className="mb-3 text-sm font-medium">Socials and contact</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input placeholder="GitHub URL" {...contentForm.register("github")} />
                  <Input placeholder="LinkedIn URL" {...contentForm.register("linkedin")} />
                  <Input placeholder="X URL" {...contentForm.register("x")} />
                  <Input placeholder="Email link (mailto:...)" {...contentForm.register("emailLink")} />
                  <Input placeholder="Website URL" {...contentForm.register("website")} />
                  <Input placeholder="Contact label" {...contentForm.register("contactLabel")} />
                  <Input placeholder="Contact title" {...contentForm.register("contactTitle")} />
                  <Input placeholder="Contact email" {...contentForm.register("contactEmail")} />
                  <Input placeholder="Contact phone" {...contentForm.register("contactPhone")} />
                  <Input placeholder="Contact location" {...contentForm.register("contactLocation")} />
                </div>
                <Textarea placeholder="Contact intro" {...contentForm.register("contactIntro")} />
              </div>

              <div className="rounded border border-border p-4">
                <p className="mb-3 text-sm font-medium">Stellar section</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input placeholder="Stellar label" {...contentForm.register("stellarLabel")} />
                  <Input placeholder="Stellar section title" {...contentForm.register("stellarTitle")} />
                </div>
                <Textarea placeholder="Stellar intro" {...contentForm.register("stellarIntro")} />
                <Textarea placeholder="Stellar contribution statement" {...contentForm.register("stellarContribution")} />
                <Textarea placeholder="Stellar accent" {...contentForm.register("stellarAccent")} />
                <Input
                  placeholder="Stellar project names (comma-separated)"
                  {...contentForm.register("stellarProjectsCsv")}
                />
              </div>

              <div className="rounded border border-border p-4">
                <p className="mb-3 text-sm font-medium">Resume lists and structured content</p>
                <Textarea
                  rows={10}
                  placeholder="Experience JSON array"
                  {...contentForm.register("experienceJson")}
                />
                <Textarea
                  rows={10}
                  placeholder="Education JSON array"
                  {...contentForm.register("educationJson")}
                />
                <Input
                  placeholder="Resume selected projects (comma-separated)"
                  {...contentForm.register("selectedProjectsCsv")}
                />
                <Input placeholder="Resume awards (comma-separated)" {...contentForm.register("awardsCsv")} />
                <Input placeholder="Resume core skills (comma-separated)" {...contentForm.register("coreSkillsCsv")} />
                <Input placeholder="Resume URL" {...contentForm.register("resumeUrl")} />
              </div>
                <Button type="submit" disabled={savingContent}>
                  {savingContent ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Content
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Add skill</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid gap-3" onSubmit={handleCreateSkill}>
                <Input placeholder="Name" {...createSkillForm.register("name")} />
                <Input placeholder="Category" {...createSkillForm.register("category")} />
                <Input placeholder="Level (optional)" {...createSkillForm.register("level")} />
                <Input type="number" placeholder="Order" {...createSkillForm.register("order")} />
                <Button type="submit">Add skill</Button>
              </form>
              <div className="mt-4 max-h-72 space-y-2 overflow-auto">
                {skills.map((skill) => (
                  <button
                    key={skill._id || skill.name}
                    type="button"
                    onClick={() => setSelectedSkillId(skill._id || "")}
                    className={`w-full rounded border p-2 text-left text-sm ${
                      selectedSkillId === skill._id ? "border-primary" : "border-border"
                    }`}
                  >
                    {skill.order}. {skill.name} <span className="text-muted-foreground">({skill.category})</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Edit selected skill</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid gap-3" onSubmit={handleUpdateSkill}>
                <Input placeholder="Name" {...editSkillForm.register("name")} />
                <Input placeholder="Category" {...editSkillForm.register("category")} />
                <Input placeholder="Level" {...editSkillForm.register("level")} />
                <Input type="number" placeholder="Order" {...editSkillForm.register("order")} />
                <div className="flex gap-2">
                  <Button type="submit">Save skill</Button>
                  <Button type="button" variant="destructive" onClick={handleDeleteSkill}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Add project</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid gap-3" onSubmit={handleCreateProject}>
                <Input placeholder="Project name" {...createProjectForm.register("name")} />
                <Input type="number" placeholder="Order" {...createProjectForm.register("order")} />
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" {...createProjectForm.register("featured")} />
                  Featured
                </label>
                <Input placeholder="Manual GitHub URL" {...createProjectForm.register("overrideGithubUrl")} />
                <Textarea placeholder="Manual description" {...createProjectForm.register("overrideDescription")} />
                <Input placeholder="Manual tags CSV" {...createProjectForm.register("overrideTagsCsv")} />
                <Input placeholder="Manual demo/homepage" {...createProjectForm.register("overrideHomepage")} />
                <ImageSelect
                  id="create-project-image-id"
                  label="Manual hero image"
                  value={createProjectForm.watch("overrideHeroImageId")}
                  onChange={(value) => createProjectForm.setValue("overrideHeroImageId", value)}
                  images={sortedImages}
                />
                <Button type="submit">Add project</Button>
              </form>
              <div className="mt-4 max-h-72 space-y-2 overflow-auto">
                {projects.map((project) => (
                  <button
                    key={project._id || project.name}
                    type="button"
                    onClick={() => setSelectedProjectId(project._id || "")}
                    className={`w-full rounded border p-2 text-left text-sm ${
                      selectedProjectId === project._id ? "border-primary" : "border-border"
                    }`}
                  >
                    {project.order}. {project.name} {project.needsRepo ? "(needsRepo)" : ""}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Edit selected project</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid gap-3" onSubmit={handleUpdateProject}>
                <Input placeholder="Project name" {...editProjectForm.register("name")} />
                <Input type="number" placeholder="Order" {...editProjectForm.register("order")} />
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" {...editProjectForm.register("featured")} />
                  Featured
                </label>
                <Input placeholder="Override GitHub URL" {...editProjectForm.register("overrideGithubUrl")} />
                <Textarea placeholder="Override description" {...editProjectForm.register("overrideDescription")} />
                <Input placeholder="Override tags CSV" {...editProjectForm.register("overrideTagsCsv")} />
                <Input placeholder="Override homepage" {...editProjectForm.register("overrideHomepage")} />
                <ImageSelect
                  id="edit-project-image-id"
                  label="Override hero image"
                  value={editProjectForm.watch("overrideHeroImageId")}
                  onChange={(value) => editProjectForm.setValue("overrideHeroImageId", value)}
                  images={sortedImages}
                />
                {selectedProject ? (
                  <div className="rounded border border-border p-3 text-xs text-muted-foreground">
                    <p className="font-semibold text-foreground">Auto-fetched metadata</p>
                    <p>Repo: {selectedProject.autoMetadata?.githubUrl || "N/A"}</p>
                    <p>Description: {selectedProject.autoMetadata?.description || "N/A"}</p>
                    <p>Tags: {(selectedProject.autoMetadata?.tags || []).join(", ") || "N/A"}</p>
                    <p>Hero image: {selectedProject.autoMetadata?.heroImageUrl || "N/A"}</p>
                  </div>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  <Button type="submit">Save project</Button>
                  <Button type="button" variant="outline" onClick={handleRefetchProject}>
                    Re-fetch from GitHub
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={syncingProjects}
                    onClick={handleResolveMissingProjects}
                  >
                    {syncingProjects ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Resolve missing metadata
                  </Button>
                  <Button type="button" variant="destructive" onClick={handleDeleteProject}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="awards" className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Add award</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid gap-3" onSubmit={handleCreateAward}>
                <Input placeholder="Title" {...createAwardForm.register("title")} />
                <Input placeholder="Organization / Event" {...createAwardForm.register("orgOrEvent")} />
                <div className="grid gap-3 md:grid-cols-2">
                  <Input type="number" placeholder="Year" {...createAwardForm.register("year")} />
                  <Input type="number" placeholder="Order" {...createAwardForm.register("order")} />
                </div>
                <Input placeholder="Placement" {...createAwardForm.register("placement")} />
                <Input placeholder="Proof URL (LinkedIn/public)" {...createAwardForm.register("proofUrl")} />
                <ImageSelect
                  id="create-award-image-id"
                  label="Award image (optional)"
                  value={createAwardForm.watch("imageId")}
                  onChange={(value) => createAwardForm.setValue("imageId", value)}
                  images={sortedImages}
                />
                <Button type="submit">Add award</Button>
              </form>

              <div className="mt-4 max-h-72 space-y-2 overflow-auto">
                {awards.map((award) => (
                  <button
                    key={award._id || `${award.title}-${award.year}`}
                    type="button"
                    onClick={() => setSelectedAwardId(award._id || "")}
                    className={`w-full rounded border p-2 text-left text-sm ${
                      selectedAwardId === award._id ? "border-primary" : "border-border"
                    }`}
                  >
                    {award.order}. {award.title} ({award.year}) {award.needsImage ? "(needsImage)" : ""}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Edit selected award</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid gap-3" onSubmit={handleUpdateAward}>
                <Input placeholder="Title" {...editAwardForm.register("title")} />
                <Input placeholder="Organization / Event" {...editAwardForm.register("orgOrEvent")} />
                <div className="grid gap-3 md:grid-cols-2">
                  <Input type="number" placeholder="Year" {...editAwardForm.register("year")} />
                  <Input type="number" placeholder="Order" {...editAwardForm.register("order")} />
                </div>
                <Input placeholder="Placement" {...editAwardForm.register("placement")} />
                <Input placeholder="Proof URL" {...editAwardForm.register("proofUrl")} />
                <ImageSelect
                  id="edit-award-image-id"
                  label="Award image"
                  value={editAwardForm.watch("imageId")}
                  onChange={(value) => editAwardForm.setValue("imageId", value)}
                  images={sortedImages}
                />
                <div className="flex flex-wrap gap-2">
                  <Button type="submit">Save award</Button>
                  <Button type="button" variant="destructive" onClick={handleDeleteAward}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media">
          <Card>
            <CardHeader>
              <CardTitle>Media library (GridFS)</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="mb-6 grid gap-3" onSubmit={handleUploadMedia}>
                <input id="media-file" type="file" accept="image/*" className="text-sm" />
                <Input placeholder="Alt text" {...mediaForm.register("alt")} />
                <Button type="submit" disabled={uploadingImage}>
                  {uploadingImage ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Upload
                </Button>
              </form>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {images.map((image) => (
                  <div key={image._id || image.fileId} className="rounded border border-border p-3">
                    <img
                      src={mediaUrl(image._id)}
                      alt={image.alt || image.filename}
                      className="mb-2 h-28 w-full rounded object-cover"
                    />
                    <p className="truncate text-xs font-medium">{image.filename}</p>
                    <p className="truncate text-xs text-muted-foreground">id: {image._id}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
