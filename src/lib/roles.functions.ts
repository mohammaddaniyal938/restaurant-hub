import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Bootstrap endpoint: the first signed-in user of a fresh restaurant backend
 * can claim the admin role. Once an admin exists, this is refused and further
 * roles must be granted by an existing admin.
 */
export const claimRestaurantAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { count, error: countError } = await supabaseAdmin
      .from("user_roles")
      .select("user_id", { count: "exact", head: true })
      .eq("role", "admin");

    if (countError) throw new Error(countError.message);
    if ((count ?? 0) > 0) {
      return { granted: false, reason: "An administrator already exists for this restaurant." };
    }

    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });

    if (error) throw new Error(error.message);
    return { granted: true, reason: "You are now the restaurant administrator." };
  });

/** Admin-only: grant or revoke a staff/admin role for another user by email. */
export const setUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: { email: string; role: "admin" | "staff" | "customer"; revoke?: boolean }) => {
    const email = String(input?.email ?? "")
      .trim()
      .toLowerCase();
    if (!email || email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("A valid email address is required.");
    }
    if (!["admin", "staff", "customer"].includes(input?.role)) {
      throw new Error("Role must be admin, staff or customer.");
    }
    return { email, role: input.role, revoke: Boolean(input.revoke) };
  })
  .handler(async ({ data, context }) => {
    const { data: isAdmin, error: roleError } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (roleError) throw new Error(roleError.message);
    if (!isAdmin) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: list, error: listError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    if (listError) throw new Error(listError.message);
    const targetId = list?.users?.find((u) => u.email?.toLowerCase() === data.email)?.id;

    if (!targetId) throw new Error("No user found with that email address.");

    if (data.revoke) {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .delete()
        .eq("user_id", targetId)
        .eq("role", data.role);
      if (error) throw new Error(error.message);
      return { ok: true, action: "revoked" as const };
    }

    const { error } = await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: targetId, role: data.role }, { onConflict: "user_id,role" });
    if (error) throw new Error(error.message);
    return { ok: true, action: "granted" as const };
  });
