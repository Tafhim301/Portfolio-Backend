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

    techStack : z.array(z.string().min(1,"Tech Stacks can not be empty"))
    .min(1, "At least one tech stack is required")

   
  }),
});


export const updateProjectSchema = z.object({
  project: z.object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters")
      .optional(),

    description: z
      .string({ error: "Description is required" })
      .min(10, "Description must be at least 10 characters")
      .optional(),

    liveUrl: z
      .string({ error: "Live URL is required" })
      .url("Must be a valid URL")
      .optional(),

    repoUrl: z
      .string({ error: "Repository URL is required" })
      .url("Must be a valid URL")
      .optional(),

    features: z
      .array(z.string().min(1, "Feature cannot be empty"))
      .min(1, "At least one feature is required")
      .optional(),

    techStack: z
      .array(z.string().min(1, "Tech Stacks cannot be empty"))
      .min(1, "At least one tech stack is required")
      .optional(),

  }),
});


