import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { API_URL } from "@/lib/constants";
import { useCartStore } from "@/store/cartStore";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useShallow } from "zustand/react/shallow";

type MenuItem = {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl?: string;
};

type MenuByCategory = {
  [category: string]: MenuItem[];
};

export default function MenuPage() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const addItem = useCartStore(useShallow((state) => state.addItem));

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/api/menu`)
      .then((res) => setMenu(res.data.menuItems || []))
      .catch(() => {
        setError("Failed to load menu.");
        toast.error("Failed to load menu.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Group menu items by category
  const menuByCategory: MenuByCategory = useMemo(() => {
    return menu.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as MenuByCategory);
  }, [menu]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-8 text-center text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-2">
      <h1 className="text-3xl font-bold mb-6 text-center">Menu</h1>
      {Object.keys(menuByCategory).length === 0 && (
        <div className="text-center text-muted-foreground">
          No menu items found.
        </div>
      )}
      {Object.entries(menuByCategory).map(([category, items]) => (
        <section key={category} className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card
                key={item._id}
                className="hover:shadow-lg transition-shadow"
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-40 object-cover rounded-t"
                  />
                )}
                <CardContent>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <CardDescription className="mb-2">
                    {item.description}
                  </CardDescription>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-semibold text-primary text-lg">
                      ₹{item.price.toFixed(2)}
                    </span>
                    <Button
                      onClick={() => {
                        addItem({
                          id: item._id,
                          name: item.name,
                          price: item.price,
                          imageUrl: item.imageUrl,
                        });
                        toast.success("Item added to cart");
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
