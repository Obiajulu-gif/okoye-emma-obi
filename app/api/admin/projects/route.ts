import { z } from "zod";
import { type NextRequest } from "next/server";

import { assertAdminSession } from "@/lib/admin-guard";
import { createProject, deleteProject, listProjects, updateProject } from "@/lib/portfolio";

const overridesSchema = z
  .object({
    githubUrl: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    heroImageId: z.string().optional(),
    homepage: z.string().optional(),
  })
  .optional();

const createSchema = z.object({
  name: z.string().min(1),
  order: z.coerce.number().int(),
  featured: z.boolean().default(false),
  githubUrl: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  languages: z.array(z.string()).optional(),
  homepage: z.string().optional(),
  imageId: z.string().optional(),
  heroImageUrl: z.string().optional(),
  needsRepo: z.boolean().optional(),
  needsImage: z.boolean().optional(),
  overrides: overridesSchema,
});

const updateSchema = createSchema.partial().extend({
  id: z.string().min(1),
});

export async function GET(request: NextRequest) {
  await assertAdminSession(request);
  const projects = await listProjects();
  return Response.json(projects);
}

export async function POST(request: NextRequest) {
  await assertAdminSession(request);
  const body = await request.json();
  const parsed = createSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const created = await createProject({
    ...parsed.data,
  });

  return Response.json(created);
}

export async function PUT(request: NextRequest) {
  await assertAdminSession(request);
  const body = await request.json();
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { id, ...payload } = parsed.data;
  const updated = await updateProject(id, payload);
  return Response.json(updated);
}

export async function DELETE(request: NextRequest) {
  await assertAdminSession(request);
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json({ error: "Missing id" }, { status: 400 });
  }

  await deleteProject(id);
  return Response.json({ ok: true });
}
