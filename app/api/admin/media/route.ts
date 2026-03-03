import { type NextRequest } from "next/server";

import { assertAdminSession } from "@/lib/admin-guard";
import { listImages } from "@/lib/media";

export async function GET(request: NextRequest) {
  await assertAdminSession(request);
  const images = await listImages();
  return Response.json(images);
}
