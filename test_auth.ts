import { clerkMiddleware } from '@clerk/nextjs/server';
export default clerkMiddleware(async (auth, req) => {
  await auth.protect();
});
