import { clerkClient } from "@clerk/express";
import { NextFunction, Request, Response } from "express";
import { prisma } from "../db/prisma";

// Middleware to ensure user is added to our db since Clerk doesn't store user data in our db
export async function ensureUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Get the user from the request
  const userId = req.auth.userId;

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    // Check if user exists in our db
    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    // If user doesn't exist, get user data from Clerk and create in our db
    if (!existingUser) {
      const clerkUser = await clerkClient.users.getUser(userId);
      const newUser = await prisma.user.create({
        data: {
          id: clerkUser.id,
          phone: clerkUser.phoneNumbers[0].phoneNumber,
          name: clerkUser.username,
        },
      });
      req.auth.userId = newUser.id;
    } else {
      req.auth.userId = existingUser.id;
    }
    next();
  } catch (error) {
    console.log("Error ensuring user:", error);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
}
