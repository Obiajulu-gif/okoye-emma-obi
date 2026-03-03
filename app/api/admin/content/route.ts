import { z } from "zod";
import { type NextRequest } from "next/server";

import { assertAdminSession } from "@/lib/admin-guard";
import { getSiteContent, updateSiteContent } from "@/lib/portfolio";

const experienceSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  period: z.string().min(1),
  location: z.string().min(1),
  highlights: z.array(z.string()),
});

const educationSchema = z.object({
  school: z.string().min(1),
  degree: z.string().min(1),
  period: z.string().min(1),
  details: z.string().min(1),
});

const schema = z.object({
  hero: z
    .object({
      eyebrow: z.string(),
      name: z.string(),
      roles: z.array(z.string()),
      description: z.string(),
      primaryCtaLabel: z.string(),
      primaryCtaUrl: z.string(),
      secondaryCtaLabel: z.string(),
      secondaryCtaUrl: z.string(),
      heroImageId: z.string().optional(),
      heroImageFallback: z.string().optional(),
    })
    .optional(),
  about: z
    .object({
      title: z.string(),
      summary: z.string(),
      body: z.string(),
    })
    .optional(),
  socials: z
    .object({
      github: z.string(),
      linkedin: z.string(),
      x: z.string(),
      email: z.string(),
      website: z.string(),
    })
    .optional(),
  contact: z
    .object({
      email: z.string(),
      phone: z.string(),
      location: z.string(),
    })
    .optional(),
  stellarSection: z
    .object({
      title: z.string(),
      intro: z.string(),
      contribution: z.string(),
      projectNames: z.array(z.string()),
    })
    .optional(),
  experience: z.array(experienceSchema).optional(),
  education: z.array(educationSchema).optional(),
  resumeHighlights: z
    .object({
      selectedProjects: z.array(z.string()),
      awards: z.array(z.string()),
      coreSkills: z.array(z.string()),
      resumeUrl: z.string(),
    })
    .optional(),
});

export async function GET(request: NextRequest) {
  await assertAdminSession(request);
  const content = await getSiteContent();
  return Response.json(content);
}

export async function PUT(request: NextRequest) {
  await assertAdminSession(request);

  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await updateSiteContent(parsed.data);
  return Response.json(updated);
}
