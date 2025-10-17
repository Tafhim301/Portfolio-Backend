import { z } from "zod";

export const createProjectSchema = z.object({
  project: z.object({
    title: z
      .string({ error: "Title is required" })
      .min(3, "Title must be at least 3 characters"),

    description: z
      .string({ error: "Description is required" })
      .min(10, "Description must be at least 10 characters"),

    liveUrl: z
      .string({ error: "Live URL is required" })
      .url("Must be a valid URL"),

    repoUrl: z
      .string({ error: "Repository URL is required" })
      .url("Must be a valid URL"),

    features: z
      .array(z.string().min(1, "Feature cannot be empty"))
      .min(1, "At least one feature is required"),

   
  }),
});

