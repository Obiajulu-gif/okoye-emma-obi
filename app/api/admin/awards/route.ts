import { z } from "zod";
import { type NextRequest } from "next/server";

import { assertAdminSession } from "@/lib/admin-guard";
import { extractOgImage } from "@/lib/link-preview";
import { storeRemoteImage } from "@/lib/media";
import { createAward, deleteAward, listAwards, updateAward } from "@/lib/portfolio";

const createSchema = z.object({
  title: z.string().min(1),
  orgOrEvent: z.string().min(1),
  year: z.coerce.number().int(),
  placement: z.string().optional(),
  order: z.coerce.number().int(),
  proofUrl: z.string().optional(),
  imageId: z.string().optional(),
  needsImage: z.boolean().optional(),
});

const updateSchema = createSchema.partial().extend({
  id: z.string().min(1),
});

async function tryAttachImageFromProof(
  proofUrl: string | undefined,
  imageId: string | undefined,
  title: string,
) {
  if (!proofUrl || imageId) {
    return { imageId, needsImage: !imageId };
  }

  try {
    const imageUrl = await extractOgImage(proofUrl);
    if (!imageUrl) {
      return { imageId: undefined, needsImage: true };
    }

    const image = await storeRemoteImage(imageUrl, title, `award-${title}`);
    return { imageId: image._id, needsImage: false };
  } catch {
    return { imageId: undefined, needsImage: true };
  }
}

export async function GET(request: NextRequest) {
  await assertAdminSession(request);
  const awards = await listAwards();
  return Response.json(awards);
}

export async function POST(request: NextRequest) {
  await assertAdminSession(request);
  const body = await request.json();
  const parsed = createSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const imageState = await tryAttachImageFromProof(
    parsed.data.proofUrl,
    parsed.data.imageId,
    parsed.data.title,
  );

  const created = await createAward({
    ...parsed.data,
    ...imageState,
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

  const imageState = await tryAttachImageFromProof(
    payload.proofUrl,
    payload.imageId,
    payload.title || "award",
  );

  const updated = await updateAward(id, {
    ...payload,
    ...imageState,
  });

  return Response.json(updated);
}

export async function DELETE(request: NextRequest) {
  await assertAdminSession(request);
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return Response.json({ error: "Missing id" }, { status: 400 });
  }

  await deleteAward(id);
  return Response.json({ ok: true });
}
