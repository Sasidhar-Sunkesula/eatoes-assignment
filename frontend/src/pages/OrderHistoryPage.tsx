import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_URL } from "@/lib/constants";
import axios from "axios";
import { useState } from "react";

type Order = {
  id: string | number;
  createdAt: string;
  orderItems: { name: string; price: number; quantity?: number }[];
};

export default function OrderHistoryPage() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/orders?phone=${phone}`);
      setOrders(res.data.orders || []);
      setFetched(true);
    } catch {
      setOrders([]);
      setFetched(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Order History</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchOrders();
        }}
        className="flex gap-2 mb-6"
      >
        <Input
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Fetch Orders"}
        </Button>
      </form>
      {fetched && orders.length === 0 && (
        <div className="text-muted-foreground">
          No orders found for this phone number.
        </div>
      )}
      {orders.map((order) => (
        <div key={order.id} className="mb-6 border rounded p-4">
          <div className="font-semibold mb-2">Order #{order.id}</div>
          <div className="text-sm mb-2 text-muted-foreground">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </div>
          <ul>
            {order.orderItems.map((item, idx) => (
              <li key={idx}>
                {item.name} — ₹{item.price}
                {item.quantity ? ` x ${item.quantity}` : ""}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
