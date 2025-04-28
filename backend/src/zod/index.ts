import { z } from "zod";

export const createMenuItemSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  category: z.string(),
  imageUrl: z.string().optional(),
});

export const updateMenuItemSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  category: z.string().optional(),
  imageUrl: z.string().optional(),
});

export const createOrderSchema = z.object({
  menuItems: z.array(z.string()),
});
