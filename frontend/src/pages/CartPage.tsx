import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore(
    useShallow((state) => ({
      items: state.items,
      removeItem: state.removeItem,
      updateQuantity: state.updateQuantity,
      clearCart: state.clearCart,
    }))
  );
  const navigate = useNavigate();
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {items.length === 0 ? (
        <div className="text-muted-foreground">Your cart is empty.</div>
      ) : (
        <>
          <ul className="divide-y">
            {items.map((item) => (
              <li key={item._id} className="flex items-center gap-4 py-4">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-sm text-muted-foreground">
                    ₹{item.price}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Button
                      size="icon"
                      onClick={() =>
                        updateQuantity(item._id, Math.max(1, item.quantity - 1))
                      }
                    >
                      -
                    </Button>
                    <span className="px-2">{item.quantity}</span>
                    <Button
                      size="icon"
                      onClick={() =>
                        updateQuantity(item._id, item.quantity + 1)
                      }
                    >
                      +
                    </Button>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => {
                    removeItem(item._id);
                    toast.success("Item removed from cart");
                  }}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-lg font-bold">
            Total: ₹{total.toFixed(2)}
          </div>
          <Button
            className="mt-4 mr-2"
            onClick={() => {
              clearCart();
              toast.success("Cart cleared");
            }}
            variant="secondary"
          >
            Clear Cart
          </Button>
          <Button
            className="mt-4"
            disabled={items.length === 0}
            onClick={() => navigate("/order")}
          >
            Place Order
          </Button>
        </>
      )}
    </div>
  );
}
