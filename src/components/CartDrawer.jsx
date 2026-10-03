import { useState } from "react";
import { IconX, IconPlus, IconMinus, IconTrash, IconTag, IconBike, IconArrowRight } from "./Icons";

export default function CartDrawer({
  isOpen,
  onClose,
  items = [],
  onIncrement,
  onDecrement,
  onRemoveItem,
  onClearCart,
  onPlaceOrder,
  appliedDiscount,
  setAppliedDiscount,
  onShowToast,
}) {
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");

  if (!isOpen) return null;

  const FREE_DELIVERY_THRESHOLD = 1500;
  const STANDARD_DELIVERY_FEE = 150;

  // Calculate items subtotal
  const subtotal = items.reduce((sum, item) => {
    const itemUnit = item.customUnitPrice || item.price;
    return sum + itemUnit * item.qty;
  }, 0);

  // Delivery fee logic
  const isFreeDelivery =
    subtotal >= FREE_DELIVERY_THRESHOLD || appliedDiscount?.type === "freedelivery";
  const deliveryFee = subtotal > 0 ? (isFreeDelivery ? 0 : STANDARD_DELIVERY_FEE) : 0;

  // Discount amount
  let discountAmount = 0;
  if (appliedDiscount) {
    if (appliedDiscount.type === "percentage") {
      discountAmount = Math.round((subtotal * appliedDiscount.value) / 100);
    } else if (appliedDiscount.type === "fixed") {
      discountAmount = Math.min(subtotal, appliedDiscount.value);
    }
  }

  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);
  const amountNeededForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const freeDeliveryProgress = Math.min(
    100,
    Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100),
  );

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError("");
    const code = couponInput.trim().toUpperCase();

    if (!code) return;

    if (code === "KARACHI20") {
      setAppliedDiscount({
        code: "KARACHI20",
        type: "percentage",
        value: 20,
        description: "20% Off Order",
      });
      if (onShowToast) onShowToast("Promo KARACHI20 applied! 20% saved 🎉");
      setCouponInput("");
    } else if (code === "WELCOME10") {
      setAppliedDiscount({
        code: "WELCOME10",
        type: "percentage",
        value: 10,
        description: "10% Welcome Discount",
      });
      if (onShowToast) onShowToast("Promo WELCOME10 applied! 10% saved 🎉");
      setCouponInput("");
    } else if (code === "FREEFRIES") {
      setAppliedDiscount({
        code: "FREEFRIES",
        type: "fixed",
        value: 299,
        description: "Free Fries Rs. 299 Credit",
      });
      if (onShowToast) onShowToast("Promo FREEFRIES applied! Rs. 299 saved 🎉");
      setCouponInput("");
    } else {
      setCouponError("Invalid coupon code. Try 'KARACHI20'");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedDiscount(null);
    if (onShowToast) onShowToast("Coupon removed");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <aside className="fixed top-0 right-0 z-50 h-screen w-full sm:w-[420px] bg-[#252B28] flex flex-col shadow-2xl border-l border-[#E4E8E5]/10 animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E4E8E5]/10 bg-[#171B19]">
          <div className="flex items-center gap-2">
            <h2 className="font-display font-extrabold text-xl text-[#E4E8E5]">Your Cart</h2>
            <span className="bg-[#718C56] text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {items.reduce((s, i) => s + i.qty, 0)} items
            </span>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-xs text-[#AFB8B0] hover:text-[#718C56] font-medium"
                title="Clear all cart items"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#252B28] hover:bg-[#343C37] flex items-center justify-center text-[#E4E8E5] transition-colors"
              aria-label="Close cart"
            >
              <IconX className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Free Delivery Meter */}
        <div className="bg-[#303A2B] px-6 py-3 border-b border-[#C5E879]/20">
          <div className="flex items-center justify-between text-xs font-bold text-[#E4E8E5] mb-1.5">
            <span className="flex items-center gap-1.5">
              <IconBike className="w-4 h-4 text-[#718C56]" />
              {isFreeDelivery
                ? "🎉 You've unlocked FREE Express Delivery!"
                : `Add Rs. ${amountNeededForFreeDelivery.toLocaleString()} more for FREE Delivery`}
            </span>
            <span className="text-[10px] text-[#AFB8B0] font-semibold">
              {freeDeliveryProgress}%
            </span>
          </div>

          <div className="w-full bg-[#252B28] h-2 rounded-full overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-[#C5E879] to-[#718C56] h-full rounded-full transition-all duration-500"
              style={{ width: `${freeDeliveryProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto scroll-thin px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20">
              <div className="w-20 h-20 rounded-full bg-[#303A2B] flex items-center justify-center text-3xl mb-4">
                🛒
              </div>
              <h3 className="font-display font-bold text-lg text-[#E4E8E5] mb-1">
                Your cart is empty
              </h3>
              <p className="text-xs text-[#AFB8B0] max-w-xs mb-6 font-normal">
                Explore our mouth-watering burgers, loaded shawarmas, and cheesy pizzas!
              </p>
              <button
                onClick={onClose}
                className="bg-[#718C56] text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-lg shadow-[#718C56]/30"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, idx) => {
                const itemPrice = (item.customUnitPrice || item.price) * item.qty;
                return (
                  <div
                    key={`${item.id}-${idx}`}
                    className="p-3.5 rounded-2xl bg-[#171B19] border border-[#E4E8E5]/10 shadow-sm flex gap-3 relative group"
                  >
                    {/* Thumbnail */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl shrink-0 bg-[#252B28]"
                    />

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-display font-bold text-sm text-[#E4E8E5] truncate">
                            {item.title}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-[#AFB8B0] hover:text-[#718C56] p-1 transition-colors"
                            aria-label="Remove item"
                          >
                            <IconTrash className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Add-ons list or custom notes */}
                        {item.selectedAddons && item.selectedAddons.length > 0 && (
                          <p className="text-[11px] text-[#718C56] font-medium truncate mt-0.5">
                            + {item.selectedAddons.map((a) => a.name).join(", ")}
                          </p>
                        )}

                        {item.spiceLevel && (
                          <span className="inline-block text-[10px] text-[#AFB8B0] font-semibold bg-[#252B28] px-2 py-0.5 rounded mt-1">
                            🌶️ {item.spiceLevel}
                          </span>
                        )}
                      </div>

                      {/* Bottom row: Price & Quantity */}
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#E4E8E5]/5">
                        <span className="font-display font-extrabold text-sm text-[#718C56]">
                          Rs. {itemPrice.toLocaleString()}
                        </span>

                        <div className="flex items-center gap-1.5 bg-[#252B28] rounded-full p-1">
                          <button
                            onClick={() => onDecrement(item.id)}
                            className="w-6 h-6 rounded-full bg-[#252B28] hover:bg-[#718C56] hover:text-white flex items-center justify-center text-xs font-bold transition-colors shadow-sm"
                            aria-label="Decrease quantity"
                          >
                            <IconMinus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-extrabold min-w-[18px] text-center">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => onIncrement(item.id)}
                            className="w-6 h-6 rounded-full bg-[#252B28] hover:bg-[#718C56] hover:text-white flex items-center justify-center text-xs font-bold transition-colors shadow-sm"
                            aria-label="Increase quantity"
                          >
                            <IconPlus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer with Promo Code & Checkout */}
        {items.length > 0 && (
          <div className="p-6 bg-[#171B19] border-t border-[#E4E8E5]/10 space-y-4">
            {/* Promo Code Form */}
            {appliedDiscount ? (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#303A2B] border border-[#718C56]/30 text-xs font-bold text-[#718C56]">
                <div className="flex items-center gap-2">
                  <IconTag className="w-4 h-4" />
                  <span>
                    Code <strong>{appliedDiscount.code}</strong> Applied (
                    {appliedDiscount.description})
                  </span>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-xs text-red-500 hover:underline font-semibold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AFB8B0]">
                      <IconTag className="w-3.5 h-3.5" />
                    </span>
                    <input
                      type="text"
                      placeholder="Enter promo (e.g. KARACHI20)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full bg-[#252B28] text-xs font-semibold pl-8 pr-3 py-2 rounded-xl border border-[#E4E8E5]/10 focus:border-[#718C56] focus:outline-none uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-[#171B19] hover:bg-[#718C56] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shrink-0"
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p className="text-[11px] text-[#718C56] font-semibold">{couponError}</p>
                )}
              </form>
            )}

            {/* Bill Summary */}
            <div className="space-y-1.5 text-xs text-[#AFB8B0] pt-2 border-t border-[#E4E8E5]/10">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#E4E8E5]">
                  Rs. {subtotal.toLocaleString()}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-[#718C56] font-semibold">
                  <span>Promo Discount</span>
                  <span>- Rs. {discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-semibold">
                  {deliveryFee === 0 ? (
                    <span className="text-[#718C56] font-bold">FREE</span>
                  ) : (
                    `Rs. ${deliveryFee}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-extrabold text-[#E4E8E5] pt-2 border-t border-[#E4E8E5]/10">
                <span className="font-display">Total Amount</span>
                <span className="font-display text-[#718C56] text-xl">
                  Rs. {grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              onClick={() =>
                onPlaceOrder({ subtotal, deliveryFee, discountAmount, grandTotal, appliedDiscount })
              }
              className="w-full bg-[#718C56] hover:bg-[#607A46] text-white font-extrabold py-3.5 rounded-2xl shadow-xl shadow-[#718C56]/30 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <span>Proceed to Checkout</span>
              <IconArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
