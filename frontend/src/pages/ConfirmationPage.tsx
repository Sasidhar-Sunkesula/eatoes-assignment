import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function ConfirmationPage() {
  return (
    <div className="max-w-lg mx-auto py-20 text-center">
      <h1 className="text-3xl font-bold mb-4">Thank you for your order!</h1>
      <p className="mb-6">
        Your order has been placed successfully. We’ll notify you when it’s
        ready for pickup.
      </p>
      <Button asChild>
        <Link to="/">Back to Menu</Link>
      </Button>
      <Button asChild variant="secondary" className="ml-2">
        <Link to="/history">View Order History</Link>
      </Button>
    </div>
  );
}
