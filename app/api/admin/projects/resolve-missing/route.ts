import { z } from "zod";
import { type NextRequest } from "next/server";

import { assertAdminSession } from "@/lib/admin-guard";
import { resolveMissingProjectMetadata } from "@/lib/portfolio";

const schema = z
  .object({
    limit: z.coerce.number().int().min(1).max(100).optional(),
  })
  .optional();

export async function POST(request: NextRequest) {
  await assertAdminSession(request);

  const body = await request.json().catch(() => ({}));
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const limit = parsed.data?.limit ?? 30;
  const updated = await resolveMissingProjectMetadata(limit, "Obiajulu-gif");
  return Response.json({ updatedCount: updated.length, updated });
}
