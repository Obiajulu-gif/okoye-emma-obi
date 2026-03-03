import { z } from "zod";
import { type NextRequest } from "next/server";

import { assertAdminSession } from "@/lib/admin-guard";
import { createSkill, deleteSkill, listSkills, updateSkill } from "@/lib/portfolio";

const createSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  level: z.string().optional(),
  order: z.coerce.number().int(),
});

const updateSchema = createSchema.partial().extend({
  id: z.string().min(1),
});

export async function GET(request: NextRequest) {
  await assertAdminSession(request);
  const skills = await listSkills();
  return Response.json(skills);
}

export async function POST(request: NextRequest) {
  await assertAdminSession(request);

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const created = await createSkill(parsed.data);
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
  const updated = await updateSkill(id, payload);
  return Response.json(updated);
}

export async function DELETE(request: NextRequest) {
  await assertAdminSession(request);

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return Response.json({ error: "Missing id" }, { status: 400 });
  }

  await deleteSkill(id);
  return Response.json({ ok: true });
}
