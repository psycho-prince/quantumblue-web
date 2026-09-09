import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, NextRequest, NextFetchEvent } from "next/server";

export default async function middleware(req: NextRequest, evt: NextFetchEvent) {
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }
  const response = await clerkMiddleware()(req, evt);
  if (response && response.headers) {
    response.headers.delete('x-clerk-auth-reason');
    response.headers.delete('x-clerk-auth-status');
  }
  return response;
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
