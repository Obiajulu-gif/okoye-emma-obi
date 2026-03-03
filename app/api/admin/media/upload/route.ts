import { type NextRequest } from "next/server";

import { assertAdminSession } from "@/lib/admin-guard";
import { uploadImageBuffer } from "@/lib/media";

const MAX_SIZE = 8 * 1024 * 1024;

export async function POST(request: NextRequest) {
  await assertAdminSession(request);

  const form = await request.formData();
  const file = form.get("file");
  const alt = String(form.get("alt") || "");

  if (!(file instanceof File)) {
    return Response.json({ error: "Missing file" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return Response.json({ error: "Only image uploads are allowed" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return Response.json({ error: "File is too large" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploaded = await uploadImageBuffer({
    filename: file.name,
    contentType: file.type,
    buffer,
    alt,
  });

  return Response.json(uploaded);
}
