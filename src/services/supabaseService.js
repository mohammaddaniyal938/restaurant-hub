import { supabase } from "@/integrations/supabase/client";
import { products as fallbackProducts } from "../data/products";

const LOCAL_STORAGE_KEYS = {
  PRODUCTS: "karachi_bites_custom_products",
  ORDERS: "karachi_bites_orders_v2",
  REVIEWS: "karachi_bites_user_reviews",
};

// Helper: Normalize product keys from Supabase / local
const normalizeProduct = (item) => {
  if (!item) return null;
  return {
    id: item.id,
    title: item.title || item.name || "Untitled Dish",
    description: item.description || "",
    price: Number(item.price || 0),
    category: item.category || "Burgers",
    rating: Number(item.rating || 4.8),
    reviewsCount: Number(item.reviews_count || item.reviewsCount || 24),
    image: item.image || item.image_url || fallbackProducts[0].image,
    badge: item.badge || "",
    isSpicy: Boolean(item.is_spicy ?? item.isSpicy),
    isVeg: Boolean(item.is_veg ?? item.isVeg),
    prepTime: item.prep_time || item.prepTime || "15-20 min",
    calories: item.calories || "650 kcal",
    ingredients: Array.isArray(item.ingredients)
      ? item.ingredients
      : typeof item.ingredients === "string"
        ? item.ingredients.split(",").map((s) => s.trim())
        : [],
    addons: Array.isArray(item.addons) ? item.addons : [],
    inStock: item.in_stock !== false && item.inStock !== false,
  };
};

export const supabaseService = {
  // ==========================================
  // 1. PRODUCTS
  // ==========================================
  async getProducts() {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("id", { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map(normalizeProduct);
        }
      }
    } catch (err) {
      console.warn("Supabase fetch products error, using fallback:", err);
    }

    // Check local custom products if Supabase table is empty or offline
    try {
      const customSaved = localStorage.getItem(LOCAL_STORAGE_KEYS.PRODUCTS);
      if (customSaved) {
        const parsed = JSON.parse(customSaved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(normalizeProduct);
        }
      }
    } catch (e) {
      console.warn("Could not read local custom products", e);
    }

    return fallbackProducts.map(normalizeProduct);
  },

  async addProduct(product) {
    const newId = Date.now();
    const formatted = {
      ...product,
      id: newId,
      title: product.title.trim(),
      price: Number(product.price),
      rating: Number(product.rating || 5.0),
      is_spicy: Boolean(product.isSpicy),
      is_veg: Boolean(product.isVeg),
      prep_time: product.prepTime || "15 min",
      in_stock: true,
    };

    // Try Supabase first
    try {
      if (supabase) {
        const { data, error } = await supabase.from("products").insert([formatted]).select();

        if (!error && data && data[0]) {
          return normalizeProduct(data[0]);
        }
      }
    } catch (err) {
      console.warn("Supabase insert product fallback to localStorage:", err);
    }

    // Fallback to localStorage
    try {
      const current = await this.getProducts();
      const updated = [normalizeProduct(formatted), ...current];
      localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
      return normalizeProduct(formatted);
    } catch (e) {
      console.error("Local add product error:", e);
      return normalizeProduct(formatted);
    }
  },

  async updateProduct(id, updates) {
    const formattedUpdates = {
      ...updates,
      price: updates.price ? Number(updates.price) : undefined,
      is_spicy: updates.isSpicy !== undefined ? Boolean(updates.isSpicy) : undefined,
      is_veg: updates.isVeg !== undefined ? Boolean(updates.isVeg) : undefined,
      prep_time: updates.prepTime || undefined,
      in_stock: updates.inStock !== undefined ? Boolean(updates.inStock) : undefined,
    };

    // Clean undefined
    Object.keys(formattedUpdates).forEach(
      (key) => formattedUpdates[key] === undefined && delete formattedUpdates[key],
    );

    try {
      if (supabase) {
        const { data, error } = await supabase
          .from("products")
          .update(formattedUpdates)
          .eq("id", id)
          .select();

        if (!error && data && data[0]) {
          return normalizeProduct(data[0]);
        }
      }
    } catch (err) {
      console.warn("Supabase update error:", err);
    }

    // LocalStorage fallback
    try {
      const current = await this.getProducts();
      const updated = current.map((p) => (String(p.id) === String(id) ? { ...p, ...updates } : p));
      localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
      return updated.find((p) => String(p.id) === String(id));
    } catch (e) {
      console.error("Local update error", e);
      return null;
    }
  },

  async deleteProduct(id) {
    try {
      if (supabase) {
        await supabase.from("products").delete().eq("id", id);
      }
    } catch (err) {
      console.warn("Supabase delete product error:", err);
    }

    try {
      const current = await this.getProducts();
      const updated = current.filter((p) => String(p.id) !== String(id));
      localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
      return true;
    } catch {
      return true;
    }
  },

  async seedDefaultProducts() {
    let successCount = 0;
    if (supabase) {
      try {
        const payload = fallbackProducts.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          price: p.price,
          category: p.category,
          rating: p.rating,
          image: p.image,
          badge: p.badge || "",
          is_spicy: p.isSpicy || false,
          is_veg: p.isVeg || false,
          prep_time: p.prepTime || "15 min",
          calories: p.calories || "650 kcal",
          ingredients: p.ingredients || [],
          addons: p.addons || [],
          in_stock: true,
        }));

        const { data, error } = await supabase
          .from("products")
          .upsert(payload, { onConflict: "id" })
          .select();

        if (!error && data) {
          successCount = data.length;
        }
      } catch (err) {
        console.warn("Error seeding to Supabase:", err);
      }
    }

    localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(fallbackProducts));
    return successCount > 0 ? successCount : fallbackProducts.length;
  },

  // ==========================================
  // 2. ORDERS
  // ==========================================
  async getOrders() {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((o) => ({
            ...o,
            orderId: o.order_id || o.orderId,
            name: o.customer_name || o.name,
            phone: o.phone,
            email: o.email,
            area: o.area,
            address: o.address,
            deliveryNotes: o.delivery_notes || o.deliveryNotes,
            paymentMethod: o.payment_method || o.paymentMethod,
            status: o.status || "pending",
            items: o.items || [],
            billSummary: o.bill_summary ||
              o.billSummary || {
                subtotal: o.subtotal || 0,
                deliveryFee: o.delivery_fee || 0,
                discountAmount: o.discount || 0,
                grandTotal: o.grand_total || 0,
              },
            createdAt: o.created_at || o.createdAt,
          }));
        }
      }
    } catch (err) {
      console.warn("Supabase fetch orders error, checking localStorage:", err);
    }

    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  async placeOrder(orderData) {
    const normalizedOrder = {
      order_id: orderData.orderId,
      customer_name: orderData.name,
      phone: orderData.phone,
      email: orderData.email || "",
      area: orderData.area,
      address: orderData.address,
      delivery_notes: orderData.deliveryNotes || "",
      payment_method: orderData.paymentMethod,
      status: "pending",
      items: orderData.items,
      subtotal: orderData.billSummary?.subtotal || 0,
      delivery_fee: orderData.billSummary?.deliveryFee || 0,
      discount: orderData.billSummary?.discountAmount || 0,
      grand_total: orderData.billSummary?.grandTotal || 0,
      created_at: new Date().toISOString(),
    };

    // Attach the signed-in customer so they can see this order in their history.
    try {
      if (supabase) {
        const { data: authData } = await supabase.auth.getUser();
        if (authData?.user?.id) {
          normalizedOrder.user_id = authData.user.id;
        }
      }
    } catch {
      // Guest checkout — order stays unlinked.
    }

    // Try Supabase insert
    try {
      if (supabase) {
        let { error } = await supabase.from("orders").insert([normalizedOrder]);
        // Keep existing installations working until the optional email column is migrated.
        if (error && normalizedOrder.email) {
          const legacyOrder = { ...normalizedOrder };
          delete legacyOrder.email;
          const retry = await supabase.from("orders").insert([legacyOrder]);
          error = retry.error;
        }
        if (error) {
          throw error;
        }
      }
    } catch (err) {
      console.warn("Supabase place order error, saved locally:", err);
    }

    // Always update localStorage
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS);
      const existing = saved ? JSON.parse(saved) : [];
      const updated = [orderData, ...existing];
      localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(updated));
    } catch (e) {
      console.error("Local order save error", e);
    }

    return orderData;
  },

  async updateOrderStatus(orderId, newStatus) {
    try {
      if (supabase) {
        await supabase.from("orders").update({ status: newStatus }).eq("order_id", orderId);
      }
    } catch (err) {
      console.warn("Supabase update order status error:", err);
    }

    try {
      const orders = await this.getOrders();
      const updated = orders.map((o) =>
        o.orderId === orderId || o.order_id === orderId ? { ...o, status: newStatus } : o,
      );
      localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(updated));
      return true;
    } catch {
      return false;
    }
  },

  clearLocalOrderHistory() {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.ORDERS);
      return true;
    } catch {
      return false;
    }
  },

  // Realtime order subscription helper
  subscribeToOrders(callback) {
    if (!supabase) return () => {};

    try {
      const channel = supabase
        .channel("public:orders")
        .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, (payload) => {
          if (callback) callback(payload);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (e) {
      console.warn("Supabase realtime subscription not available:", e);
      return () => {};
    }
  },

  // ==========================================
  // 3. REVIEWS
  // ==========================================
  async getReviews() {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from("reviews")
          .select("*")
          .order("id", { ascending: false });

        if (!error && data && data.length > 0) {
          return data;
        }
      }
    } catch (err) {
      console.warn("Supabase reviews error:", err);
    }

    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.REVIEWS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  async deleteReview(reviewId) {
    try {
      if (supabase) {
        await supabase.from("reviews").delete().eq("id", reviewId);
      }
    } catch (err) {
      console.warn("Supabase delete review error:", err);
    }

    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.REVIEWS);
      if (saved) {
        const parsed = JSON.parse(saved);
        const filtered = parsed.filter((r) => String(r.id) !== String(reviewId));
        localStorage.setItem(LOCAL_STORAGE_KEYS.REVIEWS, JSON.stringify(filtered));
      }
      return true;
    } catch {
      return false;
    }
  },
};
