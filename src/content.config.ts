import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { SITE } from "@/config";

export const BLOG_PATH = "src/data/blog";
export const AUTHORS_PATH = "src/data/authors";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      lang: z.enum(["en", "es"]).default("en"),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
      // EOTG fields
      shift: z.string().optional(), // e.g. "shift-1", "shift-2"
      sprint: z.string().optional(), // e.g. "sp1w1", "sp1w2" — metadata only
      section: z.enum(["soc", "shifts", "agents", "kb"]).optional(),
    }),
});

const authors = defineCollection({
  loader: glob({ pattern: "**/*.md", base: `./${AUTHORS_PATH}` }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    tier: z.string().optional(),
    color: z.string(),
    bio: z.string(),
    avatar: z.string().optional(),
    lang: z.enum(["en", "es"]).default("en"),
  }),
});

export const collections = { blog, authors };