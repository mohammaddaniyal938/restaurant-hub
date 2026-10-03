import { useState } from "react";
import { IconX, IconMapPin, IconUser, IconCreditCard } from "./Icons";

const KARACHI_AREAS = [
  "Clifton (Blocks 1-9)",
  "Clifton, Karachi",
  "DHA Phase 1-8",
  "DHA Phase 5 & 6",
  "Gulshan-e-Iqbal (Blocks 1-19)",
  "Gulshan-e-Iqbal",
  "PECHS Block 2, 3 & 6",
  "PECHS Block 2 & 6",
  "North Nazimabad",
  "Bahadurabad & Dhoraji",
  "Gulistan-e-Johar",
  "Malir Cantt",
  "Federal B Area",
  "Tariq Road & PECHS",
];

export default function CheckoutModal({
  onClose,
  onConfirm,
  cartItems = [],
  billSummary = {},
  selectedArea = "Clifton (Blocks 1-9)",
}) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    area: selectedArea || "Clifton (Blocks 1-9)",
    address: "",
    deliveryNotes: "",
    paymentMethod: "cod", // "cod" | "jazzcash" | "card_on_delivery" | "online_card"
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Full name is required";

    // Pakistani phone format validation (03XX or +92)
    const cleanPhone = formData.phone.replace(/[\s-]/g, "");
    if (!cleanPhone) {
      errs.phone = "Phone number is required";
    } else if (!/^((\+92)|(0092)|(03))\d{9}$/.test(cleanPhone)) {
      errs.phone = "Please enter a valid Pakistani number (e.g. 03001234567)";
    }

    if (!formData.address.trim()) {
      errs.address = "Complete street & apartment address is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setTimeout(() => {
      const order = {
        ...formData,
        orderId: `KB-${Math.floor(100000 + Math.random() * 900000)}`,
        items: cartItems,
        billSummary,
        createdAt: new Date().toISOString(),
        status: "pending",
      };

      Promise.resolve(onConfirm(order))
        .catch((error) => {
          console.error("Order confirmation failed:", error);
          setErrors({ submit: "We could not place your order. Please try again." });
        })
        .finally(() => setSubmitting(false));
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 p-3 sm:p-5 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#252B28] rounded-3xl shadow-2xl overflow-hidden animate-pop-in max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#171B19] text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#718C56] flex items-center justify-center text-sm shadow">
              🍔
            </span>
            <div>
              <h2 className="font-display font-extrabold text-lg sm:text-xl text-white leading-none">
                Complete Your Order
              </h2>
              <p className="text-[11px] text-white/60 font-medium mt-0.5">
                Karachi Express 30-Min Fast Food Delivery
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <IconX className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto scroll-thin flex-1 space-y-6">
          {/* Section 1: Customer Details */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#AFB8B0] mb-3 flex items-center gap-1.5">
              <IconUser className="w-4 h-4 text-[#718C56]" /> 1. Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#E4E8E5] mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Daniyal Khan"
                    className={`w-full text-xs sm:text-sm p-3 rounded-xl bg-[#252B28]/60 border focus:bg-[#252B28] focus:outline-none transition-all ${
                      errors.name ? "border-red-500" : "border-[#E4E8E5]/15 focus:border-[#718C56]"
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-[11px] text-red-500 font-semibold mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E4E8E5] mb-1">
                  Phone Number (for Rider) *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0300-1234567"
                    className={`w-full text-xs sm:text-sm p-3 rounded-xl bg-[#252B28]/60 border focus:bg-[#252B28] focus:outline-none transition-all ${
                      errors.phone ? "border-red-500" : "border-[#E4E8E5]/15 focus:border-[#718C56]"
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-[11px] text-red-500 font-semibold mt-1">{errors.phone}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#E4E8E5] mb-1">
                  Email Address (for receipt)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. daniyal@example.com"
                  className="w-full text-xs sm:text-sm p-3 rounded-xl bg-[#252B28]/60 border border-[#E4E8E5]/15 focus:border-[#718C56] focus:bg-[#252B28] focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Address */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#AFB8B0] mb-3 flex items-center gap-1.5">
              <IconMapPin className="w-4 h-4 text-[#718C56]" /> 2. Delivery Address in Karachi
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#E4E8E5] mb-1">
                  Karachi Town / Area *
                </label>
                <select
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl bg-[#252B28]/60 border border-[#E4E8E5]/15 focus:border-[#718C56] focus:bg-[#252B28] focus:outline-none"
                >
                  {KARACHI_AREAS.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E4E8E5] mb-1">
                  Complete Address (House #, Street, Block, Landmark) *
                </label>
                <textarea
                  rows={2}
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. House 42-B, Street 14, Near Boat Basin, Block 5"
                  className={`w-full text-xs sm:text-sm p-3 rounded-xl bg-[#252B28]/60 border focus:bg-[#252B28] focus:outline-none resize-none transition-all ${
                    errors.address ? "border-red-500" : "border-[#E4E8E5]/15 focus:border-[#718C56]"
                  }`}
                />
                {errors.address && (
                  <p className="text-[11px] text-red-500 font-semibold mt-1">{errors.address}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E4E8E5] mb-1">
                  Rider Delivery Notes (Optional)
                </label>
                <input
                  type="text"
                  name="deliveryNotes"
                  value={formData.deliveryNotes}
                  onChange={handleChange}
                  placeholder="e.g. Leave with guard, Ring door bell twice"
                  className="w-full text-xs sm:text-sm p-3 rounded-xl bg-[#252B28]/60 border border-[#E4E8E5]/15 focus:border-[#718C56] focus:bg-[#252B28] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#AFB8B0] mb-3 flex items-center gap-1.5">
              <IconCreditCard className="w-4 h-4 text-[#718C56]" /> 3. Payment Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label
                className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                  formData.paymentMethod === "cod"
                    ? "bg-[#303A2B] border-[#718C56] shadow-sm"
                    : "bg-[#252B28] border-[#E4E8E5]/15 hover:border-[#718C56]/40"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === "cod"}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#718C56] focus:ring-[#718C56] accent-[#718C56]"
                />
                <div>
                  <p className="text-xs font-bold text-[#E4E8E5] flex items-center gap-1.5">
                    💵 Cash on Delivery
                  </p>
                  <p className="text-[10px] text-[#AFB8B0]">Pay with cash upon arrival</p>
                </div>
              </label>

              <label
                className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                  formData.paymentMethod === "jazzcash"
                    ? "bg-[#303A2B] border-[#718C56] shadow-sm"
                    : "bg-[#252B28] border-[#E4E8E5]/15 hover:border-[#718C56]/40"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="jazzcash"
                  checked={formData.paymentMethod === "jazzcash"}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#718C56] focus:ring-[#718C56] accent-[#718C56]"
                />
                <div>
                  <p className="text-xs font-bold text-[#E4E8E5] flex items-center gap-1.5">
                    📱 JazzCash / EasyPaisa
                  </p>
                  <p className="text-[10px] text-[#AFB8B0]">
                    Rider shows QR or send to 0300-XXXXXXX
                  </p>
                </div>
              </label>

              <label
                className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                  formData.paymentMethod === "card_on_delivery"
                    ? "bg-[#303A2B] border-[#718C56] shadow-sm"
                    : "bg-[#252B28] border-[#E4E8E5]/15 hover:border-[#718C56]/40"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card_on_delivery"
                  checked={formData.paymentMethod === "card_on_delivery"}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#718C56] focus:ring-[#718C56] accent-[#718C56]"
                />
                <div>
                  <p className="text-xs font-bold text-[#E4E8E5] flex items-center gap-1.5">
                    💳 Card Machine on Delivery
                  </p>
                  <p className="text-[10px] text-[#AFB8B0]">Swipe your Visa/Mastercard</p>
                </div>
              </label>

              <label
                className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                  formData.paymentMethod === "online_card"
                    ? "bg-[#303A2B] border-[#718C56] shadow-sm"
                    : "bg-[#252B28] border-[#E4E8E5]/15 hover:border-[#718C56]/40"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online_card"
                  checked={formData.paymentMethod === "online_card"}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#718C56] focus:ring-[#718C56] accent-[#718C56]"
                />
                <div>
                  <p className="text-xs font-bold text-[#E4E8E5] flex items-center gap-1.5">
                    🔒 Pay Online (Instant)
                  </p>
                  <p className="text-[10px] text-[#AFB8B0]">Credit / Debit card online</p>
                </div>
              </label>
            </div>
          </div>

          {/* Section 4: Bill Review */}
          <div className="p-4 rounded-2xl bg-[#252B28] border border-[#E4E8E5]/10 space-y-2 text-xs">
            <div className="flex justify-between text-[#AFB8B0]">
              <span>Items Total ({cartItems.reduce((s, i) => s + i.qty, 0)} items)</span>
              <span className="font-semibold text-[#E4E8E5]">
                Rs. {billSummary.subtotal?.toLocaleString() || 0}
              </span>
            </div>

            {billSummary.discountAmount > 0 && (
              <div className="flex justify-between text-[#718C56] font-semibold">
                <span>Coupon Discount</span>
                <span>- Rs. {billSummary.discountAmount?.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between text-[#AFB8B0]">
              <span>Delivery Charges</span>
              <span className="font-semibold text-[#E4E8E5]">
                {billSummary.deliveryFee === 0 ? "FREE" : `Rs. ${billSummary.deliveryFee}`}
              </span>
            </div>

            <div className="flex justify-between text-base font-extrabold text-[#E4E8E5] pt-2 border-t border-[#E4E8E5]/10">
              <span className="font-display">Total Amount Payable</span>
              <span className="font-display text-[#718C56] text-xl">
                Rs. {billSummary.grandTotal?.toLocaleString() || 0}
              </span>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex gap-3 pt-2">
            {errors.submit && (
              <p className="absolute bottom-20 left-6 right-6 text-center text-[11px] font-semibold text-red-500">
                {errors.submit}
              </p>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3 rounded-2xl border border-[#E4E8E5]/20 font-bold text-xs sm:text-sm hover:bg-[#252B28] transition-colors text-[#E4E8E5]"
            >
              Back to Cart
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="w-2/3 bg-[#718C56] hover:bg-[#607A46] text-white font-extrabold py-3.5 rounded-2xl shadow-xl shadow-[#718C56]/30 active:scale-95 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-50"
            >
              {submitting ? (
                <span>Placing Order...</span>
              ) : (
                <>
                  <span>Confirm & Place Order</span>
                  <span>🚀</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
