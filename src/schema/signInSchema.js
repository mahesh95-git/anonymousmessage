import { z } from "zod";

export const signInSchema = z.object({
  identifier: z.string(),
  password: z
    .string()
    .min(3, { message: "password must be at least 3 characters" })
    .max(20, { message: "password must be at most 20 characters" }),
});
