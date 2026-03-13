import { ObjectId } from "mongodb";

import {
  defaultAwards,
  defaultProjects,
  defaultSiteContent,
  defaultSkills,
} from "@/lib/default-data";
import { collections, getDb } from "@/lib/db";
import { resolveProjectFromGitHub } from "@/lib/github";
import { serializeMongo } from "@/lib/serializers";
import type {
  AwardDoc,
  PortfolioData,
  ProjectDoc,
  SiteContentDoc,
  SkillDoc,
} from "@/types/portfolio";

const now = () => new Date().toISOString();

function parseObjectId(id: string) {
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid id");
  }

  return new ObjectId(id);
}

function stripId<T extends { _id?: unknown }>(doc: T): Omit<T, "_id"> {
  const clone = { ...doc };
  delete (clone as { _id?: unknown })._id;
  return clone;
}

function mergeStringArray(current: string[] | undefined, fallback: string[]) {
  return current?.filter(Boolean).length ? current.filter(Boolean) : fallback;
}

function mergeSectionCopy(
  current: Partial<SiteContentDoc["presentation"]["skills"]> | undefined,
  fallback: SiteContentDoc["presentation"]["skills"],
) {
  return {
    ...fallback,
    ...(current || {}),
  };
}

export function normalizeSiteContent(content?: Partial<SiteContentDoc> | null): SiteContentDoc {
  const current = content || {};

  return {
    ...defaultSiteContent,
    ...current,
    singletonKey: "main",
    hero: {
      ...defaultSiteContent.hero,
      ...(current.hero || {}),
    },
    about: {
      ...defaultSiteContent.about,
      ...(current.about || {}),
    },
    socials: {
      ...defaultSiteContent.socials,
      ...(current.socials || {}),
    },
    contact: {
      ...defaultSiteContent.contact,
      ...(current.contact || {}),
    },
    stellarSection: {
      ...defaultSiteContent.stellarSection,
      ...(current.stellarSection || {}),
      projectNames: mergeStringArray(
        current.stellarSection?.projectNames,
        defaultSiteContent.stellarSection.projectNames,
      ),
    },
    presentation: {
      brandName: current.presentation?.brandName || defaultSiteContent.presentation.brandName,
      navigation:
        current.presentation?.navigation?.length
          ? current.presentation.navigation
          : defaultSiteContent.presentation.navigation,
      skills: mergeSectionCopy(current.presentation?.skills, defaultSiteContent.presentation.skills),
      projects: mergeSectionCopy(current.presentation?.projects, defaultSiteContent.presentation.projects),
      credibility: mergeSectionCopy(
        current.presentation?.credibility,
        defaultSiteContent.presentation.credibility,
      ),
      experience: mergeSectionCopy(
        current.presentation?.experience,
        defaultSiteContent.presentation.experience,
      ),
      education: mergeSectionCopy(current.presentation?.education, defaultSiteContent.presentation.education),
      awards: mergeSectionCopy(current.presentation?.awards, defaultSiteContent.presentation.awards),
    },
    experience: current.experience?.length ? current.experience : defaultSiteContent.experience,
    education: current.education?.length ? current.education : defaultSiteContent.education,
    resumeHighlights: {
      ...defaultSiteContent.resumeHighlights,
      ...(current.resumeHighlights || {}),
      selectedProjects: mergeStringArray(
        current.resumeHighlights?.selectedProjects,
        defaultSiteContent.resumeHighlights.selectedProjects,
      ),
      awards: mergeStringArray(
        current.resumeHighlights?.awards,
        defaultSiteContent.resumeHighlights.awards,
      ),
      coreSkills: mergeStringArray(
        current.resumeHighlights?.coreSkills,
        defaultSiteContent.resumeHighlights.coreSkills,
      ),
    },
    updatedAt: typeof current.updatedAt === "string" ? current.updatedAt : defaultSiteContent.updatedAt,
  };
}

type ResolvedMetadata = Awaited<ReturnType<typeof resolveProjectFromGitHub>>;

function buildResolvedProjectUpdate(project: Partial<ProjectDoc>, metadata: ResolvedMetadata) {
  return {
    autoMetadata: metadata.autoMetadata,
    githubUrl: metadata.autoMetadata.githubUrl || project.githubUrl || "",
    description: metadata.autoMetadata.description || project.description || "",
    tags: metadata.autoMetadata.tags || project.tags || [],
    languages: metadata.autoMetadata.languages || project.languages || [],
    homepage: metadata.autoMetadata.homepage || project.homepage || "",
    heroImageUrl: metadata.autoMetadata.heroImageUrl || project.heroImageUrl || "",
    needsRepo: metadata.needsRepo,
    needsImage: metadata.needsImage,
  };
}

export async function ensureSeedData() {
  const db = await getDb();

  const siteCount = await db.collection(collections.siteContent).countDocuments();
  if (!siteCount) {
    await db.collection(collections.siteContent).insertOne({
      ...stripId(defaultSiteContent),
      updatedAt: new Date(),
    });
  }

  const skillCount = await db.collection(collections.skills).countDocuments();
  if (!skillCount) {
    await db.collection(collections.skills).insertMany(
      defaultSkills.map((skill) => ({
        ...stripId(skill),
        updatedAt: new Date(),
      })),
    );
  }

  const projectCount = await db.collection(collections.projects).countDocuments();
  if (!projectCount) {
    await db.collection(collections.projects).insertMany(
      defaultProjects.map((project) => ({
        ...stripId(project),
        updatedAt: new Date(),
      })),
    );
  }

  const awardCount = await db.collection(collections.awards).countDocuments();
  if (!awardCount) {
    await db.collection(collections.awards).insertMany(
      defaultAwards.map((award) => ({
        ...stripId(award),
        updatedAt: new Date(),
      })),
    );
  }
}

export function applyProjectOverrides(project: ProjectDoc): ProjectDoc {
  const overrides = project.overrides || {};
  const auto = project.autoMetadata || {};

  const githubUrl = overrides.githubUrl || project.githubUrl || auto.githubUrl || "";
  const description = overrides.description || project.description || auto.description || "";
  const tags =
    overrides.tags && overrides.tags.length
      ? overrides.tags
      : project.tags?.length
        ? project.tags
        : auto.tags || [];

  return {
    ...project,
    githubUrl,
    description,
    tags,
    languages: project.languages?.length ? project.languages : auto.languages || [],
    homepage: overrides.homepage || project.homepage || auto.homepage || "",
    heroImageUrl: project.heroImageUrl || auto.heroImageUrl || "",
    imageId: overrides.heroImageId || project.imageId,
    needsRepo: !githubUrl,
    needsImage: !(overrides.heroImageId || project.imageId || project.heroImageUrl || auto.heroImageUrl),
  };
}

export async function getPortfolioData(): Promise<PortfolioData> {
  try {
    await ensureSeedData();
    const db = await getDb();

    const [contentRaw, skillsRaw, projectsRaw, awardsRaw] = await Promise.all([
      db.collection(collections.siteContent).findOne({ singletonKey: "main" }),
      db.collection(collections.skills).find({}).sort({ order: 1 }).toArray(),
      db.collection(collections.projects).find({}).sort({ order: 1 }).toArray(),
      db.collection(collections.awards).find({}).sort({ order: 1 }).toArray(),
    ]);

    const content = normalizeSiteContent(
      (serializeMongo(contentRaw) || defaultSiteContent) as unknown as SiteContentDoc,
    );
    const skills = (serializeMongo(skillsRaw) || defaultSkills) as unknown as SkillDoc[];
    const projectsSerialized = (serializeMongo(projectsRaw) || defaultProjects) as unknown as ProjectDoc[];
    const awards = (serializeMongo(awardsRaw) || defaultAwards) as unknown as AwardDoc[];

    return {
      content,
      skills,
      projects: projectsSerialized.map(applyProjectOverrides),
      awards,
    };
  } catch {
    return {
      content: normalizeSiteContent(defaultSiteContent),
      skills: defaultSkills,
      projects: defaultProjects,
      awards: defaultAwards,
    };
  }
}

export async function getSiteContent() {
  await ensureSeedData();
  const db = await getDb();
  const doc = await db.collection(collections.siteContent).findOne({ singletonKey: "main" });
  return normalizeSiteContent((serializeMongo(doc) || defaultSiteContent) as unknown as SiteContentDoc);
}

export async function updateSiteContent(payload: Partial<SiteContentDoc>) {
  await ensureSeedData();
  const db = await getDb();

  const current = await getSiteContent();
  const nextDoc = normalizeSiteContent({
    ...current,
    ...payload,
    hero: payload.hero ? { ...current.hero, ...payload.hero } : current.hero,
    about: payload.about ? { ...current.about, ...payload.about } : current.about,
    socials: payload.socials ? { ...current.socials, ...payload.socials } : current.socials,
    contact: payload.contact ? { ...current.contact, ...payload.contact } : current.contact,
    stellarSection: payload.stellarSection
      ? { ...current.stellarSection, ...payload.stellarSection }
      : current.stellarSection,
    presentation: payload.presentation
      ? {
          ...current.presentation,
          ...payload.presentation,
          skills: payload.presentation.skills
            ? { ...current.presentation.skills, ...payload.presentation.skills }
            : current.presentation.skills,
          projects: payload.presentation.projects
            ? { ...current.presentation.projects, ...payload.presentation.projects }
            : current.presentation.projects,
          credibility: payload.presentation.credibility
            ? { ...current.presentation.credibility, ...payload.presentation.credibility }
            : current.presentation.credibility,
          experience: payload.presentation.experience
            ? { ...current.presentation.experience, ...payload.presentation.experience }
            : current.presentation.experience,
          education: payload.presentation.education
            ? { ...current.presentation.education, ...payload.presentation.education }
            : current.presentation.education,
          awards: payload.presentation.awards
            ? { ...current.presentation.awards, ...payload.presentation.awards }
            : current.presentation.awards,
        }
      : current.presentation,
    singletonKey: "main",
    updatedAt: now(),
  });

  await db.collection(collections.siteContent).updateOne(
    { singletonKey: "main" },
    {
      $set: {
        ...stripId(nextDoc),
        updatedAt: new Date(nextDoc.updatedAt),
      },
    },
    { upsert: true },
  );

  return nextDoc as unknown as SiteContentDoc;
}

export async function syncFrontendContentToDatabase() {
  const db = await getDb();
  const syncedAt = new Date();
  const content = normalizeSiteContent({
    ...defaultSiteContent,
    updatedAt: syncedAt.toISOString(),
  });

  await db.collection(collections.siteContent).updateOne(
    { singletonKey: "main" },
    {
      $set: {
        ...stripId(content),
        updatedAt: syncedAt,
      },
    },
    { upsert: true },
  );

  await Promise.all([
    db.collection(collections.skills).deleteMany({}),
    db.collection(collections.projects).deleteMany({}),
    db.collection(collections.awards).deleteMany({}),
  ]);

  if (defaultSkills.length) {
    await db.collection(collections.skills).insertMany(
      defaultSkills.map((skill) => ({
        ...stripId(skill),
        updatedAt: syncedAt,
      })),
    );
  }

  if (defaultProjects.length) {
    await db.collection(collections.projects).insertMany(
      defaultProjects.map((project) => ({
        ...stripId(project),
        updatedAt: syncedAt,
      })),
    );
  }

  if (defaultAwards.length) {
    await db.collection(collections.awards).insertMany(
      defaultAwards.map((award) => ({
        ...stripId(award),
        updatedAt: syncedAt,
      })),
    );
  }

  return {
    contentUpdatedAt: syncedAt.toISOString(),
    skillsCount: defaultSkills.length,
    projectsCount: defaultProjects.length,
    awardsCount: defaultAwards.length,
  };
}

export async function listSkills() {
  await ensureSeedData();
  const db = await getDb();
  const skills = await db.collection(collections.skills).find({}).sort({ order: 1 }).toArray();
  return serializeMongo(skills) as unknown as SkillDoc[];
}

export async function createSkill(payload: Omit<SkillDoc, "_id" | "updatedAt">) {
  const db = await getDb();
  const doc = {
    ...payload,
    updatedAt: new Date(),
  };

  const result = await db.collection(collections.skills).insertOne(doc);
  return serializeMongo({ ...doc, _id: result.insertedId }) as unknown as SkillDoc;
}

export async function updateSkill(id: string, payload: Partial<SkillDoc>) {
  const db = await getDb();
  await db.collection(collections.skills).updateOne(
    { _id: parseObjectId(id) },
    {
      $set: {
        ...payload,
        updatedAt: new Date(),
      },
    },
  );

  const updated = await db.collection(collections.skills).findOne({ _id: parseObjectId(id) });
  return serializeMongo(updated) as unknown as SkillDoc;
}

export async function deleteSkill(id: string) {
  const db = await getDb();
  await db.collection(collections.skills).deleteOne({ _id: parseObjectId(id) });
}

export async function listProjects() {
  await ensureSeedData();
  const db = await getDb();
  const projects = await db.collection(collections.projects).find({}).sort({ order: 1 }).toArray();
  return (serializeMongo(projects) as unknown as ProjectDoc[]).map(applyProjectOverrides);
}

export async function createProject(payload: Omit<ProjectDoc, "_id" | "updatedAt">) {
  const db = await getDb();
  const doc: Omit<ProjectDoc, "_id"> = {
    ...payload,
    tags: payload.tags || [],
    languages: payload.languages || [],
    githubUrl: payload.githubUrl || "",
    description: payload.description || "",
    homepage: payload.homepage || "",
    heroImageUrl: payload.heroImageUrl || "",
    needsRepo: payload.needsRepo ?? true,
    needsImage: payload.needsImage ?? true,
    updatedAt: new Date().toISOString(),
  };

  try {
    const metadata = await resolveProjectFromGitHub(payload.name, "Obiajulu-gif");
    const resolved = buildResolvedProjectUpdate(doc, metadata);

    doc.autoMetadata = resolved.autoMetadata;
    doc.githubUrl = resolved.githubUrl;
    doc.description = resolved.description;
    doc.tags = resolved.tags;
    doc.languages = resolved.languages;
    doc.homepage = resolved.homepage;
    doc.heroImageUrl = resolved.heroImageUrl;
    doc.needsRepo = !!(resolved.needsRepo && !payload.overrides?.githubUrl);
    doc.needsImage = !!(
      resolved.needsImage &&
      !(payload.overrides?.heroImageId || payload.imageId || resolved.heroImageUrl)
    );
  } catch {
    // Keep create non-blocking when GitHub lookup fails.
  }

  const result = await db.collection(collections.projects).insertOne(doc);
  return serializeMongo({ ...doc, _id: result.insertedId }) as unknown as ProjectDoc;
}

export async function updateProject(id: string, payload: Partial<ProjectDoc>) {
  const db = await getDb();
  await db.collection(collections.projects).updateOne(
    { _id: parseObjectId(id) },
    {
      $set: {
        ...payload,
        updatedAt: new Date(),
      },
    },
  );

  const updated = await db.collection(collections.projects).findOne({ _id: parseObjectId(id) });
  return applyProjectOverrides(serializeMongo(updated) as unknown as ProjectDoc);
}

export async function deleteProject(id: string) {
  const db = await getDb();
  await db.collection(collections.projects).deleteOne({ _id: parseObjectId(id) });
}

export async function refetchProjectMetadata(projectId: string, username = "Obiajulu-gif") {
  const db = await getDb();
  const _id = parseObjectId(projectId);
  const project = await db.collection(collections.projects).findOne({ _id });

  if (!project) {
    throw new Error("Project not found");
  }

  const metadata = await resolveProjectFromGitHub(project.name, username);
  const resolved = buildResolvedProjectUpdate(project as unknown as Partial<ProjectDoc>, metadata);

  await db.collection(collections.projects).updateOne(
    { _id },
    {
      $set: {
        ...resolved,
        updatedAt: new Date(),
      },
    },
  );

  const updated = await db.collection(collections.projects).findOne({ _id });
  return applyProjectOverrides(serializeMongo(updated) as unknown as ProjectDoc);
}

export async function resolveMissingProjectMetadata(limit = 20, username = "Obiajulu-gif") {
  await ensureSeedData();
  const db = await getDb();

  const targets = await db
    .collection(collections.projects)
    .find({
      $or: [
        { autoMetadata: { $exists: false } },
        { autoMetadata: null },
        { needsRepo: true },
        { githubUrl: "" },
      ],
    })
    .sort({ order: 1 })
    .limit(Math.max(1, Math.min(limit, 100)))
    .toArray();

  const updatedProjects: ProjectDoc[] = [];

  for (const project of targets) {
    try {
      const metadata = await resolveProjectFromGitHub(project.name, username);
      const resolved = buildResolvedProjectUpdate(project as unknown as Partial<ProjectDoc>, metadata);

      await db.collection(collections.projects).updateOne(
        { _id: project._id },
        {
          $set: {
            ...resolved,
            needsRepo: !!(resolved.needsRepo && !project.overrides?.githubUrl),
            needsImage: !!(
              resolved.needsImage &&
              !(project.overrides?.heroImageId || project.imageId || resolved.heroImageUrl)
            ),
            updatedAt: new Date(),
          },
        },
      );

      const fresh = await db.collection(collections.projects).findOne({ _id: project._id });
      if (fresh) {
        updatedProjects.push(applyProjectOverrides(serializeMongo(fresh) as unknown as ProjectDoc));
      }
    } catch {
      // Continue resolving remaining projects even if one lookup fails.
    }
  }

  return updatedProjects;
}

export async function listAwards() {
  await ensureSeedData();
  const db = await getDb();
  const awards = await db.collection(collections.awards).find({}).sort({ order: 1 }).toArray();
  return serializeMongo(awards) as unknown as AwardDoc[];
}

export async function createAward(payload: Omit<AwardDoc, "_id" | "updatedAt">) {
  const db = await getDb();
  const doc = {
    ...payload,
    updatedAt: new Date(),
  };

  const result = await db.collection(collections.awards).insertOne(doc);
  return serializeMongo({ ...doc, _id: result.insertedId }) as unknown as AwardDoc;
}

export async function updateAward(id: string, payload: Partial<AwardDoc>) {
  const db = await getDb();
  await db.collection(collections.awards).updateOne(
    { _id: parseObjectId(id) },
    {
      $set: {
        ...payload,
        updatedAt: new Date(),
      },
    },
  );

  const updated = await db.collection(collections.awards).findOne({ _id: parseObjectId(id) });
  return serializeMongo(updated) as unknown as AwardDoc;
}

export async function deleteAward(id: string) {
  const db = await getDb();
  await db.collection(collections.awards).deleteOne({ _id: parseObjectId(id) });
}
