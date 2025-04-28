import { Schema, model, Document } from "mongoose";

// TypeScript interface for a menu item document
export interface IMenuItem extends Document {
  name: string;
  description: string;
  category: string; // e.g., 'Appetizer', 'Main Course', etc.
  price: number;
  imageUrl?: string;
}

// Mongoose schema definition
const MenuItemSchema = new Schema<IMenuItem>(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

// Mongoose model
export const MenuItem = model<IMenuItem>("MenuItem", MenuItemSchema);
