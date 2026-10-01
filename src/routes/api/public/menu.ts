import { createFileRoute } from "@tanstack/react-router";
import { createPublicClient, json, preflight } from "@/lib/api-helpers.server";

/** GET /api/public/menu — public menu listing with optional filters. */
export const Route = createFileRoute("/api/public/menu")({
  server: {
    handlers: {
      OPTIONS: async () => preflight(),
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const category = url.searchParams.get("category");
        const search = url.searchParams.get("search");
        const limit = Math.min(Math.max(Number(url.searchParams.get("limit") ?? 100), 1), 200);
        const offset = Math.max(Number(url.searchParams.get("offset") ?? 0), 0);

        const supabase = createPublicClient();
        let query = supabase
          .from("products")
          .select("id, title, description, price, category, image, rating, spicy, veg, bestseller, available")
          .eq("available", true)
          .order("id", { ascending: true })
          .range(offset, offset + limit - 1);

        if (category && category !== "All") query = query.eq("category", category);
        if (search && search.trim()) query = query.ilike("title", `%${search.trim().slice(0, 80)}%`);

        const { data, error } = await query;
        if (error) return json({ error: "Could not load the menu" }, 500);
        return json({ items: data ?? [], limit, offset });
      },
    },
  },
});
