import useFetch from "@/hooks/useFetch";
import { API_URL } from "@/lib/constants";
import { useEffect, useMemo, useState } from "react";

type Order = {
  id: number;
  createdAt: string;
  orderItems: { name: string; price: number; quantity: number }[];
};

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { customFetch } = useFetch();

  // Sort orders by recent first
  const sortedByRecent = useMemo(() => {
    return [...orders].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [orders]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await customFetch(`${API_URL}/api/orders`);
        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await res.json();
        setOrders(data.orders);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-muted-foreground">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Order History</h1>
      {orders.length > 0 ? (
        sortedByRecent.map((order) => (
          <div key={order.id} className="mb-6 border rounded p-4">
            <div className="font-semibold mb-2">Order ID: {order.id}</div>
            <div className="text-sm mb-2 text-muted-foreground">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </div>
            <ul className="mb-2 space-y-1 text-sm">
              {order.orderItems.map((item, idx) => (
                <li key={idx}>
                  {item.name} — ₹{item.price}
                  {item.quantity ? ` x ${item.quantity}` : ""}
                </li>
              ))}
            </ul>
            <div className="text-sm mb-2 font-semibold text-muted-foreground">
              Total: ₹{order.orderItems.reduce((acc, item) => acc + item.price * (item.quantity), 0)}
            </div>
          </div>
        ))
      ) : (
        <div className="text-muted-foreground">
          You have not placed any orders yet.
        </div>
      )}
    </div>
  );
}
