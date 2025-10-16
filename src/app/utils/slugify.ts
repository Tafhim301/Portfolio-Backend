import slugify from "slugify";
import { prisma } from "../shared/prisma";



export async function generateUniqueSlug(
  title: string,
  model: "blog" | "project",
  field: string = "slug"
): Promise<string> {
 
  let baseSlug = slugify(title, { lower: true, strict: true });


  if (!baseSlug || baseSlug.trim() === "") {
    baseSlug = "item";
  }

  let uniqueSlug = baseSlug;
  let counter = 1;


  while (true) {
    const existing =
      model === "blog"
        ? await prisma.blog.findUnique({ where: { slug: uniqueSlug } })
        : await prisma.project.findUnique({ where: { slug: uniqueSlug } });

    if (!existing) break;

    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}
