import useFetch from "@/hooks/useFetch";
import { API_URL } from "@/lib/constants";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";

export function useHandleOrder() {
  const { items, clearCart } = useCartStore(
    useShallow((state) => ({
      items: state.items,
      clearCart: state.clearCart,
    }))
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { customFetch } = useFetch();

  const handleOrder = async (
    e: React.FormEvent,
    name: string,
    phone: string
  ) => {
    e.preventDefault();
    if (!name || !phone) {
      toast.error("Please enter all details");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (phone.length !== 10 || isNaN(Number(phone))) {
      toast.error("Please enter a valid phone number");
      return;
    }
    setLoading(true);
    try {
      // Send only menu item IDs and quantity
      const res = await customFetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify({
          menuItems: items.map((i) => ({
            menuItemId: i._id,
            quantity: i.quantity,
          })),
          recipientName: name,
          recipientPhone: phone,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to place order");
      }
      clearCart();
      toast.success("Order placed!");
      navigate("/confirmation");
    } catch {
      toast.error("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return { handleOrder, loading };
}
