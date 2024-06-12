import { z } from "zod";

export const verifyCodeSchema = z
    .string()
    .min(6, { message: "code must be at least 6 characters" })
    .max(6, { message: "code must be at most 6 characters" })

