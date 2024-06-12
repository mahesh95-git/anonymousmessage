import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, { message: "password must be at least 3 characters" })
  .max(50, { message: "password must be at most 20 characters" });

export const usernameSchema = z
  .string()
  .min(3, { message: "username must be at least 3 characters" })
  .max(20, { message: "username must be at most 20 characters" });
  
export const emailSchema = z
  .string()
  .email({ message: "please enter valid email" })
  .regex(
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
    { message: "please enter valid email" }
  );
