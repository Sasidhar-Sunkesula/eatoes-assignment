import { z } from "zod";

// Schema for creating a menu item
export const createMenuItemSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  category: z.string(),
  imageUrl: z.string().optional(),
});

// Schema for updating a menu item
export const updateMenuItemSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  category: z.string().optional(),
  imageUrl: z.string().optional(),
});

// Schema for creating an order
export const createOrderSchema = z.object({
  menuItems: z.array(
    z.object({
      menuItemId: z.string(),
      quantity: z.number().min(1),
    })
  ),
  recipientName: z.string(),
  recipientPhone: z.string().length(10),
});
