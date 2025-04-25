import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const publicRoutes = ["/", "/pages/leaderboard", "/api/fetch-metadata"];

const isPublicRoute = createRouteMatcher(publicRoutes);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files unless explicitly required
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

    // Always match API and TRPC routes
    "/(api|trpc)(.*)",
  ],
};
