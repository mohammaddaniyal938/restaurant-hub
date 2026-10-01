import { useState, useEffect } from "react";
import { IconX, IconClock, IconPhone, IconReceipt } from "./Icons";

export default function OrderTrackingModal({ order, onClose, onNewOrder }) {
  const [simulatedStep, setSimulatedStep] = useState(1); // 1: Confirmed, 2: Preparing, 3: On The Way, 4: Delivered
  const [estimatedMinutes, setEstimatedMinutes] = useState(28);

  useEffect(() => {
    if (!order) return;

    if (order.status === "delivered" || order.status === "cancelled") return;

    const timer1 = setTimeout(() => {
      setSimulatedStep(3);
      setEstimatedMinutes(14);
    }, 15000);

    const timer2 = setTimeout(() => {
      setSimulatedStep(4);
      setEstimatedMinutes(0);
    }, 35000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [order]);

  if (!order) return null;

  const statusStep = {
    pending: 1,
    preparing: 2,
    out_for_delivery: 3,
    delivered: 4,
    cancelled: 1,
  }[order.status] || 1;
  const step = order.status === "delivered" || order.status === "cancelled"
    ? statusStep
    : Math.max(statusStep, simulatedStep);

  const stepsInfo = [
    { num: 1, title: "Order Confirmed", desc: "Received at Karachi Bites kitchen", icon: "✓" },
    { num: 2, title: "Cooking & Sizzling", desc: "Chef is grilling your fresh order", icon: "👨‍🍳" },
    { num: 3, title: "Out for Delivery", desc: "Rider is speeding through Karachi streets", icon: "🛵" },
    { num: 4, title: "Enjoy Your Meal!", desc: "Delivered hot at your doorstep", icon: "🎉" },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-3 sm:p-5 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-pop-in max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#161311] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <IconX className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#2E8B57] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
              Live Order Status
            </span>
            <span className="text-xs text-white/60 font-mono">
              {order.orderId}
            </span>
          </div>

          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white mb-1">
            {order.status === "cancelled"
              ? "Order Cancelled"
              : step === 4
              ? "Order Delivered! 🍔"
              : "Your Food is on the Way!"}
          </h2>

          <p className="text-xs sm:text-sm text-white/70 flex items-center gap-2">
            <IconClock className="w-4 h-4 text-[#F5A623]" />
            <span>
              {order.status === "cancelled"
                ? "This order has been cancelled."
                : step === 4
                ? "Enjoy your piping hot meal!"
                : `Estimated arrival in ${estimatedMinutes} mins • Delivering to ${order.area || "Karachi"}`}
            </span>
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto scroll-thin flex-1 space-y-6">
          
          {/* Progress Timeline */}
          <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#1C1715]/10 shadow-sm">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#665C54] mb-4">
              Live Progress
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative">
              {stepsInfo.map((s) => {
                const isCompleted = step >= s.num;
                const isCurrent = step === s.num;
                return (
                  <div
                    key={s.num}
                    className={`flex flex-col items-center text-center p-3 rounded-xl border transition-all ${
                      isCurrent
                        ? "bg-[#FFF1EC] border-[#E4572E] shadow-sm animate-pulse"
                        : isCompleted
                        ? "bg-[#EBF7EF] border-[#2E8B57]/30"
                        : "bg-gray-50 border-gray-100 opacity-50"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold mb-2 shadow-sm ${
                        isCurrent
                          ? "bg-[#E4572E] text-white"
                          : isCompleted
                          ? "bg-[#2E8B57] text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {s.icon}
                    </div>
                    <p className="text-xs font-bold text-[#1C1715]">{s.title}</p>
                    <p className="text-[10px] text-[#665C54] mt-0.5 leading-tight">{s.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rider Card */}
          <div className="p-4 rounded-2xl bg-[#F7F2EB] border border-[#1C1715]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-12 h-12 rounded-2xl bg-[#E4572E] text-white font-extrabold text-lg flex items-center justify-center shadow">
                🛵
              </div>
              <div>
                <p className="text-xs font-bold text-[#1C1715]">
                  Tariq Mahmood (Express Rider)
                </p>
                <p className="text-[11px] text-[#665C54]">
                  Honda CD70 • KHI-9482 • ⭐ 4.9 (850+ deliveries)
                </p>
              </div>
            </div>

            <button
              onClick={() => alert(`Calling rider Tariq at 0300-8429184 for order ${order.orderId}`)}
              className="w-full sm:w-auto bg-[#161311] hover:bg-[#E4572E] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow"
            >
              <IconPhone className="w-3.5 h-3.5" />
              <span>Call Rider</span>
            </button>
          </div>

          {/* Delivery Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-white border border-[#1C1715]/10 shadow-sm">
              <p className="font-bold text-[#665C54] uppercase text-[10px] mb-1">
                Delivering To
              </p>
              <p className="font-bold text-[#1C1715]">{order.name}</p>
              <p className="text-[#665C54] mt-0.5">{order.phone}</p>
              <p className="text-[#1C1715] mt-1 font-medium">{order.address}, {order.area}</p>
              {order.deliveryNotes && (
                <p className="text-[11px] text-[#E4572E] mt-1.5 italic">
                  Note: "{order.deliveryNotes}"
                </p>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-[#1C1715]/10 shadow-sm">
              <p className="font-bold text-[#665C54] uppercase text-[10px] mb-1">
                Payment Info
              </p>
              <p className="font-bold text-[#1C1715]">
                {order.paymentMethod === "cod"
                  ? "💵 Cash on Delivery"
                  : order.paymentMethod === "jazzcash"
                  ? "📱 JazzCash / EasyPaisa"
                  : order.paymentMethod === "card_on_delivery"
                  ? "💳 Card Machine on Delivery"
                  : "🔒 Paid Online"}
              </p>
              <p className="text-lg font-extrabold text-[#E4572E] mt-2 font-display">
                Rs. {order.billSummary?.grandTotal?.toLocaleString() || 0}
              </p>
            </div>
          </div>

          {/* Ordered Items Summary */}
          <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#1C1715]/10 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#665C54] mb-2">
              <IconReceipt className="w-4 h-4 text-[#E4572E]" /> Order Summary
            </div>

            {order.items?.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-[#1C1715]/5 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#E4572E]">{item.qty}x</span>
                  <span className="font-semibold text-[#1C1715]">{item.title}</span>
                </div>
                <span className="font-bold text-[#1C1715]">
                  Rs. {((item.customUnitPrice || item.price) * item.qty).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-[#F7F2EB] border-t border-[#1C1715]/10 flex gap-3">
          <button
            onClick={() => window.print()}
            className="flex-1 py-3 bg-white hover:bg-gray-100 border border-[#1C1715]/15 text-[#1C1715] font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <IconReceipt className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>

          <button
            onClick={() => {
              onClose();
              if (onNewOrder) onNewOrder();
            }}
            className="flex-1 py-3 bg-[#E4572E] hover:bg-[#D1451C] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-[#E4572E]/30 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Order More Bites</span>
            <span>🍔</span>
          </button>
        </div>

      </div>
    </div>
  );
}
