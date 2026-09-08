import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(_req: NextRequest) {
  // Local-only auth: inject test org headers
  const res = NextResponse.next();
  res.headers.set('x-org-id', 'org-test-001');
  res.headers.set('x-user-id', 'user-test-001');
  return res;
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
