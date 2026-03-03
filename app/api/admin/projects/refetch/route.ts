import { z } from "zod";
import { type NextRequest } from "next/server";

import { assertAdminSession } from "@/lib/admin-guard";
import { refetchProjectMetadata } from "@/lib/portfolio";

const schema = z.object({
  id: z.string().min(1),
});

export async function POST(request: NextRequest) {
  await assertAdminSession(request);

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const project = await refetchProjectMetadata(parsed.data.id);
  return Response.json(project);
}
