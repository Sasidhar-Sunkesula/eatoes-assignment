import { Router } from "express";
import { MenuItem } from "../db/mongoose/menuItem.model";
import { prisma } from "../db/prisma";
import { ensureUser } from "../middleware/ensureUser";
import { createOrderSchema } from "../zod";

const router = Router();

// Get all orders
router.get("/orders", ensureUser, async (req, res) => {
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

// Get order by id
router.get("/orders/:id", async (req, res) => {
  if (!req.auth.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const id = req.params.id;
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: Number(id),
        userId: req.auth.userId,
      },
      select: {
        id: true,
        createdAt: true,
        orderItems: {
          select: {
            menuItemId: true,
            name: true,
            price: true,
          },
        },
      },
    });
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.status(200).json({ order });
  } catch (error) {
    console.log("Error fetching order:", error);
    res.status(500).json({ error: "Unable to fetch order" });
  }
});

// Create a new order (receiving cart data and user info).
router.post("/orders", ensureUser, async (req, res) => {
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
  const { menuItems } = validation.data;
  try {
    // Fetch the info of items from the mongoDB
    const menuItemsFromDB = await MenuItem.find({
      _id: { $in: menuItems },
    });
    if (menuItemsFromDB.length !== menuItems.length) {
      res.status(404).json({ error: "One or more menu items not found" });
      return;
    }
    // Wanted ly storing the price at the time of order creation
    const order = await prisma.order.create({
      data: {
        userId: req.auth.userId,
        orderItems: {
          createMany: {
            data: menuItemsFromDB.map((menuItem) => ({
              menuItemId: menuItem.id,
              name: menuItem.name,
              price: menuItem.price,
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
