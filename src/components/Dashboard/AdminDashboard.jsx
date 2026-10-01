import { useState } from "react";
import DashboardOverview from "./DashboardOverview";
import DashboardOrders from "./DashboardOrders";
import DashboardMenu from "./DashboardMenu";
import DashboardReviews from "./DashboardReviews";
import DashboardDatabase from "./DashboardDatabase";
import {
  IconDashboard,
  IconBike,
  IconUtensils,
  IconStar,
  IconShieldCheck,
  IconArrowLeft,
  IconPlus,
} from "../Icons";

export default function AdminDashboard({
  orders = [],
  products = [],
  onReturnToStore,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onShowToast,
  onRefreshData,
}) {
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "orders" | "menu" | "reviews" | "database"
  const [isAddDishOpen, setIsAddDishOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Active kitchen orders count
  const activeOrdersCount = orders.filter(
    (o) => o.status === "pending" || o.status === "preparing" || o.status === "out_for_delivery"
  ).length;

  const navItems = [
    { id: "overview", label: "Overview & Analytics", icon: <IconDashboard className="w-4 h-4" /> },
    {
      id: "orders",
      label: "Live Kitchen Orders",
      icon: <IconBike className="w-4 h-4" />,
      badge: activeOrdersCount > 0 ? activeOrdersCount : null,
    },
    { id: "menu", label: "Menu & Dish Catalog", icon: <IconUtensils className="w-4 h-4" />, count: products.length },
    { id: "reviews", label: "Customer Reviews", icon: <IconStar className="w-4 h-4" /> },
    { id: "database", label: "Supabase & Database", icon: <IconShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#F7F2EB] text-[#1C1715] flex flex-col antialiased">
      {/* TOP ADMIN HEADER */}
      <header className="sticky top-0 z-40 bg-[#161311] border-b border-white/10 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white"
            >
              ☰
            </button>

            {/* Admin Logo */}
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-[#E4572E] flex items-center justify-center text-lg shadow">
                🏪
              </span>
              <div>
                <span className="font-display font-extrabold text-lg text-white leading-none block">
                  Karachi<span className="text-[#E4572E]">Bites</span>
                </span>
                <span className="text-[10px] text-[#F5A623] uppercase font-bold tracking-wider">
                  Admin Kitchen Dashboard
                </span>
              </div>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveTab("menu");
                setIsAddDishOpen(true);
              }}
              className="hidden sm:flex bg-[#E4572E] hover:bg-[#D1451C] text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm items-center gap-1.5 transition-all"
            >
              <IconPlus className="w-3.5 h-3.5" />
              <span>New Dish</span>
            </button>

            <button
              onClick={onReturnToStore}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold px-4 py-2 rounded-xl border border-white/15 transition-colors flex items-center gap-1.5"
            >
              <IconArrowLeft className="w-4 h-4" />
              <span>Back to Storefront</span>
            </button>
          </div>

        </div>
      </header>

      {/* MAIN LAYOUT */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col lg:flex-row gap-6">
        
        {/* SIDEBAR NAVIGATION */}
        <aside
          className={`
            fixed lg:sticky top-0 lg:top-[68px] left-0 z-50 lg:z-0
            h-screen lg:h-[calc(100vh-100px)] w-72 shrink-0
            bg-white border border-[#1C1715]/10 rounded-3xl p-5 shadow-xl lg:shadow-sm
            transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
            flex flex-col justify-between overflow-y-auto scroll-thin
          `}
        >
          <div className="space-y-1.5">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C1715]/10 mb-3">
              <span className="text-xs font-extrabold text-[#665C54] uppercase tracking-wider">
                Admin Navigation
              </span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden w-6 h-6 text-gray-500 hover:text-black text-sm"
              >
                ✕
              </button>
            </div>

            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-[#161311] text-white shadow-md shadow-black/10 font-extrabold"
                      : "bg-transparent text-[#1C1715]/80 hover:bg-[#F7F2EB] hover:text-[#1C1715]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? "text-[#E4572E]" : "text-[#665C54]"}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge ? (
                    <span className="bg-[#E4572E] text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                      {item.badge}
                    </span>
                  ) : item.count !== undefined ? (
                    <span className="bg-gray-100 text-gray-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      {item.count}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* Sidebar bottom status info */}
          <div className="pt-4 border-t border-[#1C1715]/10 space-y-2 mt-6">
            <div className="p-3 rounded-2xl bg-[#FFF1EC] text-xs">
              <p className="font-extrabold text-[#E4572E]">Karachi Central Kitchen</p>
              <p className="text-[11px] text-[#665C54] mt-0.5">
                Clifton Branch • 100% Halal
              </p>
            </div>

            <button
              onClick={onReturnToStore}
              className="w-full py-2.5 bg-[#F7F2EB] hover:bg-[#161311] hover:text-white text-[#1C1715] font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <IconArrowLeft className="w-3.5 h-3.5" />
              <span>Customer Storefront</span>
            </button>
          </div>
        </aside>

        {/* TAB CONTENT AREA */}
        <main className="flex-1 min-w-0">
          {activeTab === "overview" && (
            <DashboardOverview
              orders={orders}
              products={products}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onUpdateOrderStatus={onUpdateOrderStatus}
              onOpenAddDish={() => {
                setActiveTab("menu");
                setIsAddDishOpen(true);
              }}
            />
          )}

          {activeTab === "orders" && (
            <DashboardOrders
              orders={orders}
              onUpdateOrderStatus={onUpdateOrderStatus}
              onShowToast={onShowToast}
            />
          )}

          {activeTab === "menu" && (
            <DashboardMenu
              products={products}
              onAddProduct={onAddProduct}
              onUpdateProduct={onUpdateProduct}
              onDeleteProduct={onDeleteProduct}
              onShowToast={onShowToast}
              isAddModalOpen={isAddDishOpen}
              setIsAddModalOpen={setIsAddDishOpen}
            />
          )}

          {activeTab === "reviews" && (
            <DashboardReviews
              products={products}
              onShowToast={onShowToast}
            />
          )}

          {activeTab === "database" && (
            <DashboardDatabase
              onShowToast={onShowToast}
              onRefreshData={onRefreshData}
            />
          )}
        </main>

      </div>
    </div>
  );
}
