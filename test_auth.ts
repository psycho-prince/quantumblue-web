import { clerkMiddleware } from '@clerk/nextjs/server';
export default clerkMiddleware(async (auth) => {
  await auth.protect();
});
