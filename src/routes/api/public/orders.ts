import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { authenticateRequest, createPublicClient, json, preflight } from "@/lib/api-helpers.server";

const orderItemSchema = z.object({
  id: z.union([z.number(), z.string()]),
  title: z.string().trim().min(1).max(120),
  price: z.number().nonnegative(),
  qty: z.number().int().min(1).max(50),
  addons: z.array(z.string().max(80)).max(20).optional(),
});

const orderSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(7).max(20),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  area: z.string().trim().min(2).max(120),
  address: z.string().trim().min(5).max(400),
  deliveryNotes: z.string().trim().max(500).optional(),
  paymentMethod: z.enum(["cod", "card", "wallet"]).default("cod"),
  items: z.array(orderItemSchema).min(1).max(60),
  billSummary: z
    .object({
      subtotal: z.number().nonnegative(),
      deliveryFee: z.number().nonnegative(),
      discountAmount: z.number().nonnegative(),
      grandTotal: z.number().nonnegative(),
    })
    .optional(),
});

/**
 * GET  /api/public/orders — order history for the signed-in customer (bearer token required).
 * POST /api/public/orders — place an order; guests allowed, signed-in orders are linked to the account.
 */
export const Route = createFileRoute("/api/public/orders")({
  server: {
    handlers: {
      OPTIONS: async () => preflight(),
      GET: async ({ request }) => {
        const { supabase, user } = await authenticateRequest(request);
        if (!supabase || !user) return json({ error: "Sign in required" }, 401);

        const { data, error } = await supabase
          .from("orders")
          .select(
            "order_id, status, items, subtotal, delivery_fee, discount, grand_total, area, address, payment_method, created_at",
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(100);

        if (error) return json({ error: "Could not load your orders" }, 500);
        return json({ items: data ?? [] });
      },
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return json({ error: "Invalid JSON body" }, 400);
        }

        const parsed = orderSchema.safeParse(body);
        if (!parsed.success) {
          return json({ error: "Invalid order", details: parsed.error.flatten() }, 400);
        }
        const order = parsed.data;

        const { supabase: authed, user } = await authenticateRequest(request);
        const client = authed ?? createPublicClient();

        const subtotal =
          order.billSummary?.subtotal ?? order.items.reduce((sum, i) => sum + i.price * i.qty, 0);
        const deliveryFee = order.billSummary?.deliveryFee ?? 0;
        const discount = order.billSummary?.discountAmount ?? 0;
        const grandTotal = order.billSummary?.grandTotal ?? subtotal + deliveryFee - discount;

        const orderId = `KB-${Date.now().toString(36).toUpperCase()}`;

        const { data, error } = await client
          .from("orders")
          .insert({
            order_id: orderId,
            user_id: user?.id ?? null,
            customer_name: order.name,
            phone: order.phone,
            email: order.email || null,
            area: order.area,
            address: order.address,
            delivery_notes: order.deliveryNotes ?? "",
            payment_method: order.paymentMethod,
            status: "pending",
            items: order.items,
            subtotal,
            delivery_fee: deliveryFee,
            discount,
            grand_total: grandTotal,
          })
          .select("order_id, status, grand_total, created_at")
          .maybeSingle();

        if (error) return json({ error: "Could not place the order" }, 500);
        return json({ order: data }, 201);
      },
    },
  },
});
