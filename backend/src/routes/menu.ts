import { Router } from "express";
import { MenuItem } from "../db/mongoose/menuItem.model";
import { createMenuItemSchema, updateMenuItemSchema } from "../zod";

const router = Router();

// Get all menu items
router.get("/menu", async (req, res) => {
  try {
    const menuItems = await MenuItem.find({});
    res.status(200).json({ menuItems });
  } catch (error) {
    console.log("Error fetching menu items:", error);
    res.status(500).json({ error: "Unable to fetch menu items" });
  }
});

// Get a menu item by id
router.get("/menu/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const menuItem = await MenuItem.findById(id);
    if (!menuItem) {
      res.status(404).json({ error: "Menu item not found" });
      return;
    }
    res.status(200).json({ menuItem });
  } catch (error) {
    console.log("Error fetching menu item:", error);
    res.status(500).json({ error: "Unable to fetch menu item" });
  }
});

// Create a new menu item
router.post("/menu", async (req, res) => {
  const validation = createMenuItemSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({ error: validation.error.message });
    return;
  }
  const { name, description, price, category, imageUrl } = validation.data;
  try {
    const menuItem = new MenuItem({
      name,
      description,
      price,
      category,
      imageUrl,
    });
    await menuItem.save();
    res.status(201).json({ menuItem });
  } catch (error) {
    console.log("Error creating menu item:", error);
    res.status(500).json({ error: "Unable to create menu item" });
  }
});

// Update a menu item partially by id
router.patch("/menu/:id", async (req, res) => {
  const id = req.params.id;
  const validation = updateMenuItemSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({ error: validation.error.message });
    return;
  }
  const { name, description, price, category, imageUrl } = validation.data;
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        category,
        imageUrl,
      },
      { new: true }
    );
    if (!menuItem) {
      res.status(404).json({ error: "Menu item not found" });
      return;
    }
    res.status(200).json({ menuItem });
  } catch (error) {
    console.log("Error updating menu item:", error);
    res.status(500).json({ error: "Unable to update menu item" });
  }
});

// Delete a menu item by id
router.delete("/menu/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const menuItem = await MenuItem.findByIdAndDelete(id);
    if (!menuItem) {
      res.status(404).json({ error: "Menu item not found" });
      return;
    }
    res.status(204).send();
  } catch (error) {
    console.log("Error deleting menu item:", error);
    res.status(500).json({ error: "Unable to delete menu item" });
  }
});

export default router;
