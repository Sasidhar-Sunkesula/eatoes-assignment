import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_URL } from "@/lib/constants";
import useFetch from "@/hooks/useFetch";
import { toast } from "react-hot-toast";

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
}

const initialForm = {
  name: "",
  description: "",
  price: "",
  imageUrl: "",
  category: "",
};

export default function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { customFetch } = useFetch();

  // Fetch menu items
  const fetchMenu = async () => {
    setLoading(true);
    try {
      const res = await customFetch(`${API_URL}/api/menu`);
      const data = await res.json();
      setMenuItems(data.menuItems);
    } catch {
      toast.error("Failed to fetch menu items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
    // eslint-disable-next-line
  }, []);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update menu item
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price || !form.category) {
      toast.error("Please fill all required fields");
      return;
    }
    setLoading(true);
    try {
      if (editingId) {
        // Edit
        const res = await customFetch(`${API_URL}/api/menu/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            description: form.description,
            price: Number(form.price),
            imageUrl: form.imageUrl,
            category: form.category,
          }),
        });
        if (!res.ok) throw new Error();
        toast.success("Menu item updated");
      } else {
        // Add
        const res = await customFetch(`${API_URL}/api/menu`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            description: form.description,
            price: Number(form.price),
            imageUrl: form.imageUrl,
            category: form.category,
          }),
        });
        if (!res.ok) throw new Error();
        toast.success("Menu item added");
      }
      setForm(initialForm);
      setEditingId(null);
      fetchMenu();
    } catch {
      toast.error(editingId ? "Failed to update item" : "Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  // Delete menu item
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) return;
    setLoading(true);
    try {
      const res = await customFetch(`${API_URL}/api/menu/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success("Menu item deleted");
      fetchMenu();
    } catch {
      toast.error("Failed to delete item");
    } finally {
      setLoading(false);
    }
  };

  // Edit menu item
  const handleEdit = (item: MenuItem) => {
    setEditingId(item._id);
    setForm({
      name: item.name,
      description: item.description,
      price: String(item.price),
      imageUrl: item.imageUrl || "",
      category: item.category,
    });
  };

  // Cancel edit
  const handleCancel = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Menu Management</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-2 border p-4 rounded mb-8 bg-muted"
      >
        <div className="flex gap-2">
          <Input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <Input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            required
          />
        </div>
        <Input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <div className="flex gap-2">
          <Input
            name="price"
            placeholder="Price"
            value={form.price}
            type="number"
            min="0"
            onChange={handleChange}
            required
          />
          <Input
            name="imageUrl"
            placeholder="Image URL (optional)"
            value={form.imageUrl}
            onChange={handleChange}
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>
            {editingId ? "Update Item" : "Add Item"}
          </Button>
          {editingId && (
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
      <h2 className="text-xl font-semibold mb-4">Menu Items</h2>
      {menuItems.length === 0 ? (
        <div className="text-muted-foreground">No menu items found.</div>
      ) : (
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li key={item._id} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <div className="font-semibold">{item.name}</div>
                <div className="text-sm text-muted-foreground">{item.category}</div>
                <div className="text-sm">₹{item.price}</div>
                <div className="text-xs text-muted-foreground">{item.description}</div>
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.name} className="h-16 mt-2 rounded" />
                )}
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                  Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(item._id)}>
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
