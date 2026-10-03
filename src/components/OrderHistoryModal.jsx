import { IconX, IconReceipt, IconBike } from "./Icons";

export default function OrderHistoryModal({
  isOpen,
  onClose,
  orderHistory = [],
  onTrackOrder,
  onViewReceipt,
  onClearHistory,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 p-3 sm:p-5 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#252B28] rounded-3xl shadow-2xl overflow-hidden animate-pop-in max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#171B19] text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <IconReceipt className="w-5 h-5 text-[#718C56]" />
            <h2 className="font-display font-extrabold text-xl text-white">
              Past Orders & Receipts
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {orderHistory.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-xs text-white/50 hover:text-red-400 font-semibold transition-colors"
              >
                Clear History
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <IconX className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Orders list */}
        <div className="p-6 overflow-y-auto scroll-thin flex-1 space-y-4">
          {orderHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16">
              <div className="w-16 h-16 rounded-full bg-[#252B28] flex items-center justify-center text-3xl mb-3">
                📜
              </div>
              <h3 className="font-display font-bold text-base text-[#E4E8E5] mb-1">
                No past orders found
              </h3>
              <p className="text-xs text-[#AFB8B0] max-w-xs mb-4 font-normal">
                Once you place an order, your invoices and live tracking will appear right here!
              </p>
            </div>
          ) : (
            orderHistory.map((order, idx) => {
              const formattedDate = order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-PK", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Recent Order";

              return (
                <div
                  key={order.orderId || idx}
                  className="p-4 rounded-2xl bg-[#171B19] border border-[#E4E8E5]/10 shadow-sm hover:border-[#718C56]/30 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-[#E4E8E5]/5 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-[#171B19] text-white px-2 py-0.5 rounded">
                        {order.orderId}
                      </span>
                      <span className="text-[11px] text-[#AFB8B0]">{formattedDate}</span>
                    </div>

                    <span className="bg-[#303A2B] text-[#718C56] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                      Completed
                    </span>
                  </div>

                  {/* Items preview */}
                  <div className="space-y-1 text-xs">
                    {order.items?.map((item, i) => (
                      <div key={i} className="flex justify-between text-[#AFB8B0]">
                        <span>
                          {item.qty}x {item.title}
                        </span>
                        <span className="font-medium text-[#E4E8E5]">
                          Rs. {((item.customUnitPrice || item.price) * item.qty).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Address & Total */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#E4E8E5]/5 text-xs">
                    <div className="text-[11px] text-[#AFB8B0] truncate max-w-[200px]">
                      📍 {order.area}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] text-[#AFB8B0] block">Total Paid</span>
                        <span className="font-display font-extrabold text-sm text-[#718C56]">
                          Rs. {order.billSummary?.grandTotal?.toLocaleString() || 0}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onViewReceipt(order)}
                          className="bg-[#252B28] hover:bg-[#303A2B] border border-[#E4E8E5]/15 text-[#E4E8E5] font-bold text-xs px-3 py-1.5 rounded-xl transition-colors"
                        >
                          Receipt
                        </button>
                        <button
                          onClick={() => onTrackOrder(order)}
                          className="bg-[#171B19] hover:bg-[#718C56] text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1 shadow-sm"
                        >
                          <IconBike className="w-3.5 h-3.5" />
                          <span>Track</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
