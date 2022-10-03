import { createRouter } from "./context";
import { z } from "zod";
import { prisma } from "@/server/db/client";

export const userRouter = createRouter()
  .query("findOne", {
    input: z
      .object({
        id: z.number(),
      })
      .nullish(),
    resolve({ input }) {
      return prisma.user.findUnique({
        where: {
          id: input?.id,
        }
      });
    }
  })
