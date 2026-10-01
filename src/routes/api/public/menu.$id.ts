import { createFileRoute } from "@tanstack/react-router";
import { createPublicClient, json, preflight } from "@/lib/api-helpers.server";

/** GET /api/public/menu/:id — single dish with its reviews. */
export const Route = createFileRoute("/api/public/menu/$id")({
  server: {
    handlers: {
      OPTIONS: async () => preflight(),
      GET: async ({ params }) => {
        const id = Number(params.id);
        if (!Number.isInteger(id) || id <= 0) return json({ error: "Invalid dish id" }, 400);

        const supabase = createPublicClient();
        const [{ data: product, error }, { data: reviews }] = await Promise.all([
          supabase
            .from("products")
            .select(
              "id, title, description, price, category, image, rating, reviews_count, is_spicy, is_veg, badge, calories, prep_time, ingredients, addons, in_stock",
            )
            .eq("id", id)
            .maybeSingle(),
          supabase
            .from("reviews")
            .select("id, rating, comment, customer_name, created_at")
            .eq("product_id", id)
            .order("created_at", { ascending: false })
            .limit(20),
        ]);

        if (error) return json({ error: "Could not load this dish" }, 500);
        if (!product) return json({ error: "Dish not found" }, 404);
        return json({ item: product, reviews: reviews ?? [] });
      },
    },
  },
});
