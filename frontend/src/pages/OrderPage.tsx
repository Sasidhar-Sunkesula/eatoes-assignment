import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useHandleOrder } from "@/hooks/useHandleOrder";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

export default function OrderPage() {
  const items = useCartStore(useShallow((state) => state.items));
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const { handleOrder, loading } = useHandleOrder();

  if (items.length === 0) {
    return (
      <div className="h-96 w-full flex items-center justify-center">
        Your cart is empty.
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Place Your Order</h1>
      <form onSubmit={(e) => handleOrder(e, name, phone)} className="space-y-4">
        <Input
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          placeholder="9876543210"
          value={phone}
          // Only set phone if it's a valid number
          onChange={(e) => {
            if (!isNaN(Number(e.target.value))) {
              setPhone(e.target.value);
            }
          }}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Placing Order..." : "Submit Order"}
        </Button>
      </form>
      <div className="mt-6">
        <h2 className="font-semibold mb-2">Order Summary</h2>
        <ul className="text-sm mb-2 space-y-1">
          {items.map((item) => (
            <li key={item._id}>
              {item.name} x {item.quantity} — ₹
              {(item.price * item.quantity).toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
