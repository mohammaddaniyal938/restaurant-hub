import { createFileRoute } from "@tanstack/react-router";
import { createPublicClient, json, preflight } from "@/lib/api-helpers.server";

/** GET /api/public/categories — active food categories. */
export const Route = createFileRoute("/api/public/categories")({
  server: {
    handlers: {
      OPTIONS: async () => preflight(),
      GET: async () => {
        const supabase = createPublicClient();
        const { data, error } = await supabase
          .from("categories")
          .select("id, name, description, image, sort_order")
          .eq("is_active", true)
          .order("sort_order", { ascending: true });

        if (error) return json({ error: "Could not load categories" }, 500);
        return json({ items: data ?? [] });
      },
    },
  },
});
