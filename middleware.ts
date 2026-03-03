import { NextResponse, type NextRequest } from "next/server";

import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/auth";

function unauthorizedApi() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const session = token ? await verifyAdminSession(token) : null;

  if (pathname === "/admin" && session) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  const protectedAdminPage = pathname.startsWith("/admin/dashboard");
  const protectedAdminApi = pathname.startsWith("/api/admin") && pathname !== "/api/admin/login";

  if (!protectedAdminPage && !protectedAdminApi) {
    return NextResponse.next();
  }

  if (!session) {
    if (protectedAdminApi) {
      return unauthorizedApi();
    }

    const loginUrl = new URL("/admin", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
