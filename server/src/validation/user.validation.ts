import { z } from "zod";

export const userValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 chars"),
  role: z.enum(["EMPLOYEE", "MANAGER"]).default("EMPLOYEE"),
  manager_id: z.string().optional(),
});

export const userLoginValidation = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 chars"),
})




export type UserInput = z.infer<typeof userValidationSchema>;
