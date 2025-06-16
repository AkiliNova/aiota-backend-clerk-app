import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { routeAccessMap } from "./lib/settings";

// Build matchers from your access map
const matchers = Object.keys(routeAccessMap).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccessMap[route],
}));

const isPublicRoute = createRouteMatcher([
  "/api/mobile/login",
  "/api/admin/users/create-user", // Optional: allow user creation
  "/api/admin/users",           // Optional: allow user listing
  "/api/admin(.*)",  // Optional: allow all mobile API routes
]);

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) {
   return;
  }
}
);

// Prevents middleware from running on static assets
export const config = {
  matcher: [
    "/((?!_next|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|css|js|ts|json|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
