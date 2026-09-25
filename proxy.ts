import { auth } from "@/auth";

export default auth((request) => {
  const isLoggedIn = !!request.auth;
  const pathname = request.nextUrl.pathname;

  const protectedRoutes = [
    "/dashboard",
    "/transactions",
    "/goals",
    "/statistics",
    "/settings",
  ];

  const isProtectedRoute = protectedRoutes.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`)
  );

  if (isProtectedRoute && !isLoggedIn) {
    return Response.redirect(
      new URL("/login", request.nextUrl.origin)
    );
  }

  return;
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/transactions/:path*",
    "/goals/:path*",
    "/statistics/:path*",
    "/settings/:path*",
  ],
};
