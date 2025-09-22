// src/lib/validation.ts - Updated validation schema
import { z } from "zod";

export const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
  description: z.string().min(20, "Description must be at least 20 characters").max(500, "Description must be less than 500 characters"),
  category: z.enum([
    "accommodation",
    "surfing", 
    "tours",
    "food",
    "transport", 
    "home",
    "beauty",
    "events",
    "other"
  ], {
    errorMap: () => ({ message: "Please select a valid category" })
  }),
  link: z
    .string()
    .url("Please enter a valid URL")
    .refine(async (url) => {
      try {
        const res = await fetch(url, { method: "HEAD" });
        const contentType = res.headers.get("content-type");
        return contentType?.startsWith("image/");
      } catch {
        return false;
      }
    }, "URL must be a valid image")
    .optional()
    .or(z.literal("")),
  pitch: z.string().min(10, "Service details must be at least 10 characters"),
  priceRange: z.enum([
    "free",
    "budget",
    "moderate", 
    "premium",
    "luxury",
    "quote"
  ]).optional(),
  contactMethod: z.enum([
    "phone",
    "whatsapp",
    "email", 
    "person"
  ]).optional(),
  contactDetails: z.string().optional(),
  serviceRadius: z.string().transform((val) => {
    const num = parseInt(val);
    if (isNaN(num) || num < 1 || num > 50) {
      return 5; // default value
    }
    return num;
  }).optional(),
});