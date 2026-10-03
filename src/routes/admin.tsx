import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import AdminDashboard from "@/components/Dashboard/AdminDashboard";
import Toast from "@/components/Toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthProvider, useAuth } from "@/lib/auth-context.jsx";
import { supabaseService } from "@/services/supabaseService";
import { fireConfetti } from "@/utils/confetti";

export const Route = createFileRoute("/admin")({
  ssr: false,
  component: () => (
    <AuthProvider>
      <AdminDashboardPage />
    </AuthProvider>
  ),
});

function AdminDashboardPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [toast, setToast] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    window.setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 3500);
  };

  const loadProducts = async () => {
    const data = await supabaseService.getProducts();
    setProducts(data);
  };

  const loadOrders = async () => {
    const data = await supabaseService.getOrders();
    setOrders(data);
  };

  useEffect(() => {
    if (!auth.loading && (!auth.user || !auth.isAdmin)) {
      navigate({ to: "/admin-login", replace: true });
      return;
    }

    if (auth.user && auth.isAdmin) {
      loadProducts();
      loadOrders();
    }
  }, [auth.loading, auth.user, auth.isAdmin, navigate]);

  const handleAddProduct = async (productData) => {
    const created = await supabaseService.addProduct(productData);
    setProducts((prev) => [created, ...prev]);
  };

  const handleUpdateProduct = async (id, updates) => {
    const updated = await supabaseService.updateProduct(id, updates);
    setProducts((prev) => prev.map((p) => (String(p.id) === String(id) ? { ...p, ...updated } : p)));
  };

  const handleDeleteProduct = async (id) => {
    await supabaseService.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => String(p.id) !== String(id)));
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    await supabaseService.updateOrderStatus(orderId, newStatus);
    setOrders((prev) => prev.map((order) => (order.orderId === orderId ? { ...order, status: newStatus } : order)));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin-login", replace: true });
  };

  const handleConfirmOrder = async (orderData) => {
    const placed = await supabaseService.placeOrder(orderData);
    fireConfetti();
    setOrders((prev) => [placed, ...prev]);
    showToast(`Order ${placed.orderId} placed successfully! 🎉`);
  };

  if (auth.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#252B28]">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#718C56] text-3xl text-white shadow-xl shadow-[#718C56]/25">
            🍔
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#AFB8B0]">
            Checking admin access...
          </p>
        </div>
      </div>
    );
  }

  if (!auth.user || !auth.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#252B28]">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <AdminDashboard
        orders={orders}
        products={products}
        onReturnToStore={() => navigate({ to: "/" })}
        onLogout={handleLogout}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onShowToast={showToast}
        onRefreshData={() => {
          loadProducts();
          loadOrders();
        }}
      />
    </div>
  );
}
