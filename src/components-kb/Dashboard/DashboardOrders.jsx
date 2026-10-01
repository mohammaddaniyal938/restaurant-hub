import { useState } from "react";
import {
  IconSearch,
  IconX,
  IconReceipt,
  IconPhone,
  IconMapPin,
} from "../Icons";

export default function DashboardOrders({
  orders = [],
  onUpdateOrderStatus,
  onShowToast,
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);

  const statuses = [
    { id: "all", label: "All Orders", count: orders.length },
    { id: "pending", label: "New Orders", count: orders.filter((o) => o.status === "pending").length },
    { id: "preparing", label: "In Kitchen", count: orders.filter((o) => o.status === "preparing").length },
    { id: "out_for_delivery", label: "Out for Delivery", count: orders.filter((o) => o.status === "out_for_delivery").length },
    { id: "delivered", label: "Delivered", count: orders.filter((o) => o.status === "delivered").length },
    { id: "cancelled", label: "Cancelled", count: orders.filter((o) => o.status === "cancelled").length },
  ];

  const filteredOrders = orders.filter((order) => {
    // Status match
    const statusMatch = statusFilter === "all" || order.status === statusFilter;

    // Search match
    let searchMatch = true;
    if (search.trim() !== "") {
      const q = search.trim().toLowerCase();
      const inId = order.orderId?.toLowerCase().includes(q);
      const inName = order.name?.toLowerCase().includes(q);
      const inPhone = order.phone?.toLowerCase().includes(q);
      const inArea = order.area?.toLowerCase().includes(q);
      searchMatch = inId || inName || inPhone || inArea;
    }

    return statusMatch && searchMatch;
  });

  const handleStatusChange = (orderId, newStatus) => {
    onUpdateOrderStatus(orderId, newStatus);
    if (onShowToast) onShowToast(`Order ${orderId} marked as ${newStatus}!`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="bg-amber-100 text-amber-800 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase">⏳ New Order</span>;
      case "preparing":
        return <span className="bg-orange-100 text-orange-800 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase">👨‍🍳 Cooking in Kitchen</span>;
      case "out_for_delivery":
        return <span className="bg-blue-100 text-blue-800 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase">🛵 Out for Delivery</span>;
      case "delivered":
        return <span className="bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase">✓ Delivered</span>;
      case "cancelled":
        return <span className="bg-rose-100 text-rose-800 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase">✕ Cancelled</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Search Toolbar */}
      <div className="bg-white p-5 rounded-3xl border border-[#1C1715]/10 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-xl text-[#1C1715]">
            Customer Orders Management
          </h2>
          <p className="text-xs text-[#665C54]">
            {filteredOrders.length} orders found • Live synchronization with customer tracking
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#665C54]">
            <IconSearch className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, customer, phone, area..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#F7F2EB]/70 border border-[#1C1715]/10 text-xs font-medium focus:outline-none focus:border-[#E4572E] focus:bg-white transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
            >
              <IconX className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {statuses.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              statusFilter === tab.id
                ? "bg-[#161311] text-white shadow-md"
                : "bg-white text-[#1C1715]/70 hover:bg-[#F7F2EB] border border-[#1C1715]/10"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                statusFilter === tab.id ? "bg-[#E4572E] text-white" : "bg-[#F7F2EB] text-[#665C54]"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#1C1715]/10 overflow-hidden shadow-sm">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 text-xs text-[#665C54]">
            No orders match the selected filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F2EB]/60 border-b border-[#1C1715]/10 text-[#665C54] uppercase text-[10px] font-extrabold">
                <tr>
                  <th className="py-3.5 px-4">Order ID & Date</th>
                  <th className="py-3.5 px-4">Customer Details</th>
                  <th className="py-3.5 px-4">Address / Zone</th>
                  <th className="py-3.5 px-4">Order Total</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Update Status & Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1715]/5">
                {filteredOrders.map((order) => {
                  const grandTotal =
                    order.billSummary?.grandTotal || order.grand_total || 0;

                  return (
                    <tr key={order.orderId} className="hover:bg-[#FFFDF9] transition-colors">
                      {/* ID & Date */}
                      <td className="py-4 px-4 font-mono">
                        <span className="font-extrabold text-sm text-[#1C1715] block">
                          {order.orderId}
                        </span>
                        <span className="text-[10px] text-[#665C54]">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString("en-PK", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "Just now"}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-4">
                        <p className="font-bold text-[#1C1715] text-xs sm:text-sm">
                          {order.name}
                        </p>
                        <p className="text-[11px] text-[#665C54]">{order.phone}</p>
                      </td>

                      {/* Address */}
                      <td className="py-4 px-4 max-w-[200px]">
                        <p className="font-semibold text-[#1C1715] truncate">
                          {order.area}
                        </p>
                        <p className="text-[10px] text-[#665C54] truncate">
                          {order.address}
                        </p>
                      </td>

                      {/* Total */}
                      <td className="py-4 px-4">
                        <span className="font-display font-extrabold text-base text-[#E4572E]">
                          Rs. {grandTotal.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-[#665C54] block">
                          {order.items?.length || 0} items • {order.paymentMethod === "cod" ? "Cash" : "Online/Card"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {getStatusBadge(order.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <select
                            value={order.status || "pending"}
                            onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                            className="bg-[#F7F2EB] hover:bg-[#EDE4D8] border border-[#1C1715]/10 text-[#1C1715] text-[11px] font-bold rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#E4572E] cursor-pointer"
                          >
                            <option value="pending">⏳ New Order</option>
                            <option value="preparing">👨‍🍳 In Kitchen</option>
                            <option value="out_for_delivery">🛵 Out for Delivery</option>
                            <option value="delivered">✓ Delivered</option>
                            <option value="cancelled">✕ Cancelled</option>
                          </select>

                          <button
                            onClick={() => setSelectedOrderDetail(order)}
                            className="bg-[#161311] hover:bg-[#E4572E] text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors shadow-sm"
                          >
                            Invoice
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ORDER DETAILS INVOICE MODAL */}
      {selectedOrderDetail && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 p-3 sm:p-5 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedOrderDetail(null)}
        >
          <div
            className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-pop-in max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#161311] text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-white/60 uppercase font-mono tracking-wider">
                  Order Invoice
                </span>
                <h3 className="font-display font-extrabold text-2xl text-white">
                  {selectedOrderDetail.orderId}
                </h3>
              </div>

              <button
                onClick={() => setSelectedOrderDetail(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <IconX className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto scroll-thin flex-1 space-y-5 text-xs">
              {/* Customer summary */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#F7F2EB]">
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#665C54]">Customer</p>
                  <p className="font-bold text-[#1C1715] text-sm mt-0.5">{selectedOrderDetail.name}</p>
                  <p className="text-[#665C54] mt-0.5 flex items-center gap-1">
                    <IconPhone className="w-3 h-3 text-[#E4572E]" /> {selectedOrderDetail.phone}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase font-bold text-[#665C54]">Delivery Location</p>
                  <p className="font-bold text-[#1C1715] mt-0.5">{selectedOrderDetail.area}</p>
                  <p className="text-[#665C54] mt-0.5 flex items-center gap-1">
                    <IconMapPin className="w-3 h-3 text-[#E4572E]" /> {selectedOrderDetail.address}
                  </p>
                </div>
              </div>

              {selectedOrderDetail.deliveryNotes && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-medium">
                  <strong>Rider Note:</strong> "{selectedOrderDetail.deliveryNotes}"
                </div>
              )}

              {/* Items List */}
              <div>
                <h4 className="font-extrabold uppercase tracking-wider text-[#665C54] text-[10px] mb-3">
                  Ordered Dishes & Customizations
                </h4>

                <div className="space-y-2">
                  {selectedOrderDetail.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-[#1C1715]/10 flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="font-bold text-[#1C1715] text-xs">
                          {item.qty}x {item.title}
                        </p>
                        {item.selectedAddons && item.selectedAddons.length > 0 && (
                          <p className="text-[11px] text-[#E4572E]">
                            + {item.selectedAddons.map((a) => a.name).join(", ")}
                          </p>
                        )}
                        {item.spiceLevel && (
                          <span className="text-[10px] text-[#665C54]">
                            🌶️ {item.spiceLevel}
                          </span>
                        )}
                      </div>

                      <span className="font-bold text-[#1C1715]">
                        Rs. {((item.customUnitPrice || item.price) * item.qty).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bill summary */}
              <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#1C1715]/10 space-y-1.5">
                <div className="flex justify-between text-[#665C54]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1C1715]">
                    Rs. {selectedOrderDetail.billSummary?.subtotal?.toLocaleString() || 0}
                  </span>
                </div>

                <div className="flex justify-between text-[#665C54]">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-[#1C1715]">
                    {selectedOrderDetail.billSummary?.deliveryFee === 0 ? "FREE" : `Rs. ${selectedOrderDetail.billSummary?.deliveryFee || 0}`}
                  </span>
                </div>

                {selectedOrderDetail.billSummary?.discountAmount > 0 && (
                  <div className="flex justify-between text-[#2E8B57] font-semibold">
                    <span>Discount</span>
                    <span>- Rs. {selectedOrderDetail.billSummary?.discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-base font-extrabold text-[#1C1715] pt-2 border-t border-[#1C1715]/10">
                  <span className="font-display">Total Paid</span>
                  <span className="font-display text-[#E4572E] text-lg">
                    Rs. {selectedOrderDetail.billSummary?.grandTotal?.toLocaleString() || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-[#F7F2EB] border-t border-[#1C1715]/10 flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 bg-white hover:bg-gray-100 border border-[#1C1715]/15 text-[#1C1715] font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <IconReceipt className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>

              <button
                onClick={() => setSelectedOrderDetail(null)}
                className="flex-1 py-3 bg-[#161311] hover:bg-[#E4572E] text-white font-bold text-xs rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
