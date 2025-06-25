import { secretRouter } from "@/server/api/routers/secret";
import { authRouter } from "@/server/api/routers/auth";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  secret: secretRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

//Create a server-side caller for the tRPC API.
export const createCaller = createCallerFactory(appRouter);
