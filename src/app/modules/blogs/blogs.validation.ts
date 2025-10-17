import { z } from "zod";

export const createBlogSchema = z.object({
  blog: z.object({
    title: z
      .string({ error: "Title is required" })
      .min(3, "Title must be at least 3 characters"),

    content: z
      .string({ error: "Content is required" })
      .min(10, "Content must be at least 10 characters"),

    excerpt: z
      .string({ error: "Excerpt is required" })
      .min(5, "Excerpt must be at least 5 characters"),

    tags: z
      .array(z.string().min(1, "Tag cannot be empty"))
      .optional()
      .default([]),
  }),
});



export const updateBlogSchema = z.object({
  blog: z.object({
    title: z.string().min(3, "Title must be at least 3 characters").optional(),
    content: z.string().min(10, "Content must be at least 10 characters").optional(),
    excerpt: z.string().min(5, "Excerpt must be at least 5 characters").optional(),
    tags: z.array(z.string().min(1, "Tag cannot be empty")).optional(),
    isFeatured: z.boolean().optional(),
  }),
});

