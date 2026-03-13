import { type NextRequest } from "next/server";

import { assertAdminSession } from "@/lib/admin-guard";
import { syncFrontendContentToDatabase } from "@/lib/portfolio";

export async function POST(request: NextRequest) {
  await assertAdminSession(request);

  const result = await syncFrontendContentToDatabase();
  return Response.json(result);
}
