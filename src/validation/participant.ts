import { z } from "zod";

export const participantProfileSchema = z.object({
  participant_name: z.string().min(2).optional(),
  college_name: z.string().min(2).optional(),
  department: z.string().min(1).optional(),
  academic_year: z.string().min(1).optional(),
  contact_number: z
    .string()
    .regex(/^[0-9]{10}$/, "Invalid phone number")
    .optional(),
});
