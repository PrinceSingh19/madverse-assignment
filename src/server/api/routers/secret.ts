import { z } from "zod";
import bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";

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

  getMySecrets: protectedProcedure
    .input(
      z
        .object({
          search: z.string().optional(),
          status: z.enum(["all", "active", "viewed", "expired"]).default("all"),
          sortBy: z.enum(["createdAt", "expiresAt"]).default("createdAt"),
          sortOrder: z.enum(["asc", "desc"]).default("desc"),
          limit: z.number().min(1).max(100).default(20),
          offset: z.number().min(0).default(0),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const { search, status, sortBy, sortOrder, limit, offset } = input ?? {};
      const now = new Date();

      // Build where clause
      const where: Record<string, unknown> = {
        createdById: ctx.session.user.id,
      };

      // Add search filter
      if (search) {
        where.content = {
          contains: search,
          mode: "insensitive",
        };
      }

      // Add status filter
      if (status === "active") {
        where.AND = [
          { isViewed: false },
          {
            OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
          },
        ];
      } else if (status === "viewed") {
        where.isViewed = true;
      } else if (status === "expired") {
        where.expiresAt = { lte: now };
      }

      const secrets = await ctx.db.secret.findMany({
        where,
        orderBy: { [sortBy as string]: sortOrder },
        take: limit,
        skip: offset,
        select: {
          id: true,
          content: true,
          oneTimeAccess: true,
          expiresAt: true,
          isViewed: true,
          viewedAt: true,
          createdAt: true,
          updatedAt: true,
          password: true, // Include to check if password protected
        },
      });

      // Get total count for pagination
      const total = await ctx.db.secret.count({ where });

      // Transform secrets to include computed status and hide password content
      const transformedSecrets = secrets.map((secret) => {
        const isExpired = secret.expiresAt && secret.expiresAt <= now;
        const hasPassword = !!secret.password;

        return {
          ...secret,
          password: undefined, // Don't return password hash
          hasPassword,
          status: isExpired ? "expired" : secret.isViewed ? "viewed" : "active",
          isExpired,
        };
      });

      return {
        secrets: transformedSecrets,
        total,
        hasMore: (offset ?? 0) + (limit ?? 20) < total,
      };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
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

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        content: z.string().min(1).optional(),
        password: z.string().optional(),
        oneTimeAccess: z.boolean().optional(),
        expiresAt: z.date().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, content, password, oneTimeAccess, expiresAt } = input;

      // Check if secret exists and belongs to user
      const existingSecret = await ctx.db.secret.findFirst({
        where: {
          id,
          createdById: ctx.session.user.id,
        },
      });

      if (!existingSecret) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Secret not found or you don't have permission to update it",
        });
      }

      // Check if secret has already been viewed (can't update viewed secrets)
      if (existingSecret.isViewed) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Cannot update a secret that has already been viewed",
        });
      }

      // Prepare update data
      const updateData: Record<string, unknown> = {};

      if (content !== undefined) {
        updateData.content = content;
      }

      if (password !== undefined) {
        updateData.password = password ? await bcrypt.hash(password, 12) : null;
      }

      if (oneTimeAccess !== undefined) {
        updateData.oneTimeAccess = oneTimeAccess;
      }

      if (expiresAt !== undefined) {
        updateData.expiresAt = expiresAt;
      }

      return ctx.db.secret.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          content: true,
          oneTimeAccess: true,
          expiresAt: true,
          isViewed: true,
          viewedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if secret exists and belongs to user
      const existingSecret = await ctx.db.secret.findFirst({
        where: {
          id: input.id,
          createdById: ctx.session.user.id,
        },
      });

      if (!existingSecret) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Secret not found or you don't have permission to delete it",
        });
      }

      return ctx.db.secret.delete({
        where: { id: input.id },
      });
    }),

  getMyStats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const now = new Date();

    // Get all user's secrets for statistics
    const secrets = await ctx.db.secret.findMany({
      where: { createdById: userId },
      select: {
        id: true,
        isViewed: true,
        expiresAt: true,
        createdAt: true,
        oneTimeAccess: true,
      },
    });

    const total = secrets.length;
    const viewed = secrets.filter((s) => s.isViewed).length;
    const expired = secrets.filter(
      (s) => s.expiresAt && s.expiresAt <= now,
    ).length;
    const active = secrets.filter((s) => {
      const isExpired = s.expiresAt && s.expiresAt <= now;
      return !s.isViewed && !isExpired;
    }).length;
    const oneTimeAccess = secrets.filter((s) => s.oneTimeAccess).length;

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSecrets = secrets.filter(
      (s) => s.createdAt >= thirtyDaysAgo,
    ).length;

    return {
      total,
      active,
      viewed,
      expired,
      oneTimeAccess,
      recentSecrets,
    };
  }),
});
