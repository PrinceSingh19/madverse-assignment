import { z } from "zod";
import bcrypt from "bcryptjs";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const secretRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1),
        password: z.string().optional(),
        oneTimeAccess: z.boolean().default(false),
        expiresAt: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const hashedPassword = input.password
        ? await bcrypt.hash(input.password, 12)
        : null;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return ctx.db.secret.create({
        data: {
          content: input.content,
          password: hashedPassword,
          oneTimeAccess: input.oneTimeAccess,
          expiresAt: input.expiresAt,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getMySecrets: protectedProcedure.query(async ({ ctx }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return ctx.db.secret.findMany({
      where: { createdById: ctx.session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        content: true,
        oneTimeAccess: true,
        expiresAt: true,
        isViewed: true,
        viewedAt: true,
        createdAt: true,
        password: false, // Don't return password hash
      },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const secret = await ctx.db.secret.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          content: true,
          password: true,
          oneTimeAccess: true,
          expiresAt: true,
          isViewed: true,
          viewedAt: true,
          createdAt: true,
        },
      });

      if (!secret) {
        throw new Error("Secret not found");
      }

      // Check if secret has expired
      if (secret.expiresAt && secret.expiresAt < new Date()) {
        throw new Error("Secret has expired");
      }

      // Check if secret was already viewed (for one-time access)
      if (secret.oneTimeAccess && secret.isViewed) {
        throw new Error("Secret has already been viewed");
      }

      return secret;
    }),

  viewSecret: publicProcedure
    .input(
      z.object({
        id: z.string(),
        password: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const secret = await ctx.db.secret.findUnique({
        where: { id: input.id },
      });

      if (!secret) {
        throw new Error("Secret not found");
      }

      // Check if secret has expired
      if (secret.expiresAt && secret.expiresAt < new Date()) {
        throw new Error("Secret has expired");
      }

      // Check if secret was already viewed (for one-time access)
      if (secret.oneTimeAccess && secret.isViewed) {
        throw new Error("Secret has already been viewed");
      }

      // Check password if required
      if (secret.password) {
        if (!input.password) {
          throw new Error("Password required");
        }
        const passwordMatch = await bcrypt.compare(
          input.password,
          secret.password,
        );
        if (!passwordMatch) {
          throw new Error("Invalid password");
        }
      }

      // Mark as viewed if one-time access
      if (secret.oneTimeAccess) {
        await ctx.db.secret.update({
          where: { id: input.id },
          data: {
            isViewed: true,
            viewedAt: new Date(),
          },
        });
      }

      return {
        content: secret.content,
        isViewed: secret.oneTimeAccess,
      };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return ctx.db.secret.delete({
        where: {
          id: input.id,
          createdById: ctx.session.user.id, // Ensure user can only delete their own secrets
        },
      });
    }),
});
