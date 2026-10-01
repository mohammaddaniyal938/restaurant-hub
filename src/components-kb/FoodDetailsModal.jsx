import { useState } from "react";
import {
  getReviewsByProductId,
  addReviewToStorage,
} from "../data/product-rating";
import {
  IconStar,
  IconX,
  IconPlus,
  IconMinus,
  IconClock,
  IconFlame,
  IconShieldCheck,
  IconCheck,
  IconCart,
  IconHeart,
} from "./Icons";

export default function FoodDetailsModal({
  product,
  onClose,
  onAddToCart,
  isFavorite,
  onToggleFavorite,
  onShowToast,
}) {
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [spiceLevel, setSpiceLevel] = useState("Medium");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [activeTab, setActiveTab] = useState("details"); // "details" | "reviews"
  
  // Reviews state initialized from product
  const [reviewsList, setReviewsList] = useState(() => {
    return product ? getReviewsByProductId(product.id) : [];
  });
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");

  if (!product) return null;

  const toggleAddon = (addon) => {
    setSelectedAddons((prev) =>
      prev.some((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  const addonsTotal = selectedAddons.reduce((sum, item) => sum + item.price, 0);
  const unitPrice = product.price + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) {
      alert("Please provide your name and a brief review comment.");
      return;
    }

    const reviewObj = {
      productid: product.id,
      username: newReviewName.trim(),
      rating: Number(newReviewRating),
      review: newReviewComment.trim(),
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
    };

    addReviewToStorage(reviewObj);
    setReviewsList((prev) => [reviewObj, ...prev]);
    setNewReviewName("");
    setNewReviewComment("");
    if (onShowToast) onShowToast("Thank you for your review! ⭐");
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity, {
      selectedAddons,
      spiceLevel,
      specialInstructions: specialInstructions.trim(),
      unitPrice,
    });
    if (onShowToast) {
      onShowToast(`Added ${quantity}x ${product.title} to your cart! 🛒`);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-3 sm:p-5 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-[#161311] text-[#1C1715] hover:text-white backdrop-blur-md shadow-lg flex items-center justify-center transition-all duration-200"
          aria-label="Close dialog"
        >
          <IconX className="w-5 h-5" />
        </button>

        {/* LEFT COLUMN: Food Imagery & Quick Nutrition Badges */}
        <div className="w-full md:w-5/12 bg-[#161311] relative p-6 flex flex-col justify-between shrink-0">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="bg-[#E4572E] text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                {product.category}
              </span>
              <button
                onClick={() => onToggleFavorite(product)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-colors"
                aria-label="Favorite"
              >
                <IconHeart
                  className={`w-4 h-4 ${
                    isFavorite ? "text-[#E4572E] fill-[#E4572E]" : "text-white"
                  }`}
                />
              </button>
            </div>

            {/* Food Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl h-56 sm:h-64 md:h-72 w-full bg-[#231F1C]">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-white/10 text-white z-10">
            <div className="text-center p-2 rounded-xl bg-white/5">
              <p className="text-[10px] text-white/50 uppercase font-semibold">Prep Time</p>
              <p className="text-xs font-bold text-white flex items-center justify-center gap-1 mt-0.5">
                <IconClock className="w-3 h-3 text-[#E4572E]" /> {product.prepTime || "15 min"}
              </p>
            </div>

            <div className="text-center p-2 rounded-xl bg-white/5">
              <p className="text-[10px] text-white/50 uppercase font-semibold">Calories</p>
              <p className="text-xs font-bold text-white flex items-center justify-center gap-1 mt-0.5">
                <IconFlame className="w-3 h-3 text-[#F5A623]" /> {product.calories || "650 kcal"}
              </p>
            </div>

            <div className="text-center p-2 rounded-xl bg-white/5">
              <p className="text-[10px] text-white/50 uppercase font-semibold">Quality</p>
              <p className="text-xs font-bold text-white flex items-center justify-center gap-1 mt-0.5">
                <IconShieldCheck className="w-3 h-3 text-[#2E8B57]" /> 100% Halal
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Customization, Reviews & Add to Cart */}
        <div className="flex-1 flex flex-col justify-between bg-white max-h-[80vh] md:max-h-[92vh] overflow-hidden">
          
          {/* Top Bar with Tab Switcher */}
          <div className="px-6 pt-5 pb-3 border-b border-[#1C1715]/10 flex items-center gap-4">
            <button
              onClick={() => setActiveTab("details")}
              className={`pb-2 text-xs sm:text-sm font-extrabold transition-colors relative ${
                activeTab === "details"
                  ? "text-[#E4572E]"
                  : "text-[#665C54] hover:text-[#1C1715]"
              }`}
            >
              Overview & Customization
              {activeTab === "details" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E4572E] rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-2 text-xs sm:text-sm font-extrabold transition-colors relative flex items-center gap-1.5 ${
                activeTab === "reviews"
                  ? "text-[#E4572E]"
                  : "text-[#665C54] hover:text-[#1C1715]"
              }`}
            >
              <span>Customer Reviews</span>
              <span className="bg-[#F7F2EB] text-[#1C1715] text-[10px] font-bold px-2 py-0.5 rounded-full">
                {reviewsList.length}
              </span>
              {activeTab === "reviews" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E4572E] rounded-full" />
              )}
            </button>
          </div>

          {/* Body Content (Scrollable) */}
          <div className="p-6 overflow-y-auto scroll-thin flex-1">
            {activeTab === "details" ? (
              <div className="space-y-6">
                {/* Title & Rating */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center gap-1 bg-[#FEF6E8] text-[#F5A623] px-2.5 py-0.5 rounded-full text-xs font-bold">
                      <IconStar className="w-3.5 h-3.5 fill-[#F5A623]" />
                      <span>{product.rating}</span>
                    </div>
                    <span className="text-xs text-[#665C54]">
                      ({reviewsList.length} verified reviews)
                    </span>
                  </div>

                  <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1C1715]">
                    {product.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#665C54] mt-2 leading-relaxed font-normal">
                    {product.description}
                  </p>
                </div>

                {/* Ingredients chips */}
                {product.ingredients && product.ingredients.length > 0 && (
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#665C54] mb-2">
                      Key Ingredients
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {product.ingredients.map((ing, idx) => (
                        <span
                          key={idx}
                          className="bg-[#F7F2EB] text-[#1C1715] text-xs font-medium px-3 py-1 rounded-lg"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Spice Level Selector */}
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#665C54] mb-2">
                    Select Spice Level
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    {["Mild", "Medium", "Hot", "Karachi Fiery 🔥"].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setSpiceLevel(lvl)}
                        className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all ${
                          spiceLevel === lvl
                            ? "bg-[#E4572E] text-white border-[#E4572E] shadow"
                            : "bg-[#F7F2EB]/50 border-transparent text-[#1C1715]/80 hover:bg-[#F7F2EB]"
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add-ons List */}
                {product.addons && product.addons.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#665C54]">
                        Extra Add-ons & Upgrades
                      </h3>
                      <span className="text-[11px] text-[#665C54]">Optional</span>
                    </div>

                    <div className="space-y-2">
                      {product.addons.map((addon) => {
                        const isChecked = selectedAddons.some((a) => a.id === addon.id);
                        return (
                          <div
                            key={addon.id}
                            onClick={() => toggleAddon(addon)}
                            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                              isChecked
                                ? "bg-[#FFF1EC] border-[#E4572E] text-[#1C1715]"
                                : "bg-white border-[#1C1715]/10 hover:border-[#E4572E]/40"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                                  isChecked
                                    ? "bg-[#E4572E] text-white"
                                    : "border border-gray-300 bg-white"
                                }`}
                              >
                                {isChecked && <IconCheck className="w-3.5 h-3.5" />}
                              </div>
                              <span className="text-xs sm:text-sm font-semibold">
                                {addon.name}
                              </span>
                            </div>
                            <span className="text-xs font-bold text-[#E4572E]">
                              +Rs. {addon.price}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Special Instructions */}
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#665C54] mb-1.5">
                    Cooking Instructions
                  </h3>
                  <textarea
                    rows={2}
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g. Extra spicy sauce on the side, no onions, well-toasted bun..."
                    className="w-full text-xs sm:text-sm p-3 rounded-xl bg-[#F7F2EB]/60 border border-[#1C1715]/10 focus:border-[#E4572E] focus:outline-none placeholder:text-[#665C54]/50 resize-none font-normal"
                  />
                </div>
              </div>
            ) : (
              /* REVIEWS TAB */
              <div className="space-y-6">
                {/* Write a Review Form */}
                <form
                  onSubmit={handleAddReview}
                  className="bg-[#F7F2EB]/70 border border-[#1C1715]/10 rounded-2xl p-4 space-y-3"
                >
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#1C1715]">
                    Leave a Review for {product.title}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Your Name (e.g. Ali Khan)"
                      value={newReviewName}
                      onChange={(e) => setNewReviewName(e.target.value)}
                      className="text-xs p-2.5 rounded-xl bg-white border border-[#1C1715]/10 focus:border-[#E4572E] focus:outline-none"
                    />

                    <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-[#1C1715]/10">
                      <span className="text-xs font-semibold text-[#665C54]">Your Rating:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReviewRating(star)}
                            className="p-0.5 text-base"
                          >
                            <IconStar
                              className={`w-4 h-4 ${
                                star <= newReviewRating
                                  ? "text-[#F5A623] fill-[#F5A623]"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    required
                    placeholder="Tell other foodies what you loved about this dish..."
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-white border border-[#1C1715]/10 focus:border-[#E4572E] focus:outline-none resize-none font-normal"
                  />

                  <button
                    type="submit"
                    className="w-full py-2 bg-[#161311] hover:bg-[#E4572E] text-white font-bold text-xs rounded-xl transition-colors shadow"
                  >
                    Submit Review ⭐
                  </button>
                </form>

                {/* Reviews List */}
                <div className="space-y-3">
                  {reviewsList.length === 0 ? (
                    <p className="text-xs text-center py-6 text-[#665C54]">
                      No reviews yet for this dish. Be the first to leave one!
                    </p>
                  ) : (
                    reviewsList.map((r, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-2xl bg-white border border-[#1C1715]/10 shadow-sm"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#E4572E]/10 text-[#E4572E] font-bold text-xs flex items-center justify-center">
                              {r.username.charAt(0)}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-[#1C1715]">
                                {r.username}
                              </p>
                              <p className="text-[10px] text-[#665C54]">
                                {r.date || "Verified Buyer"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-0.5 text-xs text-[#F5A623] font-bold">
                            <IconStar className="w-3.5 h-3.5 fill-[#F5A623]" />
                            <span>{r.rating}</span>
                          </div>
                        </div>

                        <p className="text-xs text-[#1C1715]/80 font-normal leading-relaxed">
                          "{r.review}"
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Bottom Footer: Quantity, Total & Add to Cart */}
          <div className="p-4 sm:p-5 bg-[#F7F2EB] border-t border-[#1C1715]/10 flex items-center justify-between gap-4">
            {/* Quantity Stepper */}
            <div className="flex items-center gap-2 bg-white rounded-2xl p-1.5 border border-[#1C1715]/10 shadow-sm">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-xl bg-[#F7F2EB] hover:bg-[#E4572E] hover:text-white flex items-center justify-center font-bold text-sm transition-colors"
                aria-label="Decrease quantity"
              >
                <IconMinus className="w-3.5 h-3.5" />
              </button>
              <span className="font-display font-extrabold text-base min-w-[24px] text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-xl bg-[#F7F2EB] hover:bg-[#2E8B57] hover:text-white flex items-center justify-center font-bold text-sm transition-colors"
                aria-label="Increase quantity"
              >
                <IconPlus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Total and Add Button */}
            <div className="flex-1 flex items-center justify-end gap-3 sm:gap-4">
              <div className="text-right">
                <span className="text-[10px] text-[#665C54] uppercase font-bold block">
                  Total
                </span>
                <span className="font-display font-extrabold text-lg sm:text-xl text-[#E4572E]">
                  Rs. {totalPrice.toLocaleString()}
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="bg-[#E4572E] hover:bg-[#D1451C] text-white font-extrabold text-xs sm:text-sm px-5 sm:px-6 py-3 rounded-2xl shadow-lg shadow-[#E4572E]/30 active:scale-95 transition-all flex items-center gap-2"
              >
                <IconCart className="w-4 h-4" />
                <span>Add to Order</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}