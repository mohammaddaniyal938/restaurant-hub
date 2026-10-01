import { createFileRoute } from "@tanstack/react-router";
import { authenticateRequest, json, preflight } from "@/lib/api-helpers.server";

/** GET /api/public/orders/:orderId — order tracking for the owning customer or staff. */
export const Route = createFileRoute("/api/public/orders/$orderId")({
  server: {
    handlers: {
      OPTIONS: async () => preflight(),
      GET: async ({ request, params }) => {
        const orderId = params.orderId?.trim();
        if (!orderId || orderId.length > 40) return json({ error: "Invalid order id" }, 400);

        const { supabase, user } = await authenticateRequest(request);
        if (!supabase || !user) return json({ error: "Sign in required" }, 401);

        // Row-level security limits this to the customer's own orders, or any order for staff.
        const { data, error } = await supabase
          .from("orders")
          .select("order_id, status, items, grand_total, area, address, created_at, updated_at")
          .eq("order_id", orderId)
          .maybeSingle();

        if (error) return json({ error: "Could not load the order" }, 500);
        if (!data) return json({ error: "Order not found" }, 404);
        return json({ order: data });
      },
    },
  },
});
