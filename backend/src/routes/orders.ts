import { Router, Request, Response } from "express";
import { MenuItem } from "../db/mongoose/menuItem.model";
import { prisma } from "../db/prisma";
import { ensureUser } from "../middleware/ensureUser";
import { createOrderSchema } from "../zod";

const router = Router();

// Get all orders
router.get("/orders", ensureUser, async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: req.auth.userId!,
      },
      select: {
        id: true,
        createdAt: true,
        orderItems: {
          select: {
            menuItemId: true,
            name: true,
            price: true,
            quantity: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json({ orders });
  } catch (error) {
    console.log("Error fetching orders:", error);
    res.status(500).json({ error: "Unable to fetch orders" });
  }
});

// Create a new order (receiving cart data and user info).
router.post("/orders", ensureUser, async (req: Request, res: Response) => {
  if (!req.auth.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  // Only get the menuItems Ids from the request body, we fetch the menu items from the database
  const validation = createOrderSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({ error: validation.error.message });
    return;
  }
  const { menuItems, recipientName, recipientPhone } = validation.data;
  try {
    // Fetch the info of items from the mongoDB
    const menuItemsFromDB = await MenuItem.find({
      _id: { $in: menuItems.map((i) => i.menuItemId) },
    });
    if (menuItemsFromDB.length !== menuItems.length) {
      res.status(404).json({ error: "One or more menu items not found" });
      return;
    }
    // Wanted ly storing the price at the time of order creation
    const order = await prisma.order.create({
      data: {
        userId: req.auth.userId,
        recipientName,
        recipientPhone,
        orderItems: {
          createMany: {
            data: menuItemsFromDB.map((menuItem) => ({
              menuItemId: menuItem.id,
              name: menuItem.name,
              // Unit price of the item
              price: menuItem.price,
              quantity:
                menuItems.find((i) => i.menuItemId === menuItem.id)?.quantity ||
                1,
            })),
          },
        },
      },
    });
    res.status(201).json({ order });
  } catch (error) {
    console.log("Error creating order:", error);
    res.status(500).json({ error: "Unable to create order" });
  }
});

export default router;
