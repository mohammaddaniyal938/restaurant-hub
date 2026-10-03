import { IconFilter, IconStar, IconX, IconFlame, IconTag } from "./Icons";

export default function Sidebar({
  categories,
  category,
  setCategory,
  rating,
  setRating,
  price,
  setPrice,
  onlySpicy,
  setOnlySpicy,
  onlyVeg,
  setOnlyVeg,
  onlyBestseller,
  setOnlyBestseller,
  productCountsByCategory,
  onResetFilters,
  isOpen,
  onClose,
  activeFilterCount,
}) {
  const priceOptions = [
    { value: "All", label: "All Prices" },
    { value: "0-500", label: "Under Rs. 500" },
    { value: "501-1000", label: "Rs. 501 - 1,000" },
    { value: "1001-1500", label: "Rs. 1,001 - 1,500" },
    { value: "1501-plus", label: "Rs. 1,500+" },
  ];

  const ratingOptions = [
    { value: 0, label: "All Ratings" },
    { value: 4.8, label: "4.8+ Stars (Top Rated)" },
    { value: 4.5, label: "4.5+ Stars" },
    { value: 4.0, label: "4.0+ Stars" },
  ];

  return (
    <>
      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed lg:sticky top-0 lg:top-[74px] left-0 z-50 lg:z-0
          h-screen lg:h-[calc(100vh-74px)] w-80 lg:w-72 shrink-0
          bg-[#252B28] border-r border-[#E4E8E5]/10 p-5 sm:p-6 overflow-y-auto scroll-thin
          transition-transform duration-300 ease-out shadow-2xl lg:shadow-none
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        `}
      >
        {/* Header with Title and Reset */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E4E8E5]/10 mb-6">
          <div className="flex items-center gap-2">
            <IconFilter className="w-5 h-5 text-[#718C56]" />
            <h2 className="font-display font-bold text-lg text-[#E4E8E5]">Filter Menu</h2>
            {activeFilterCount > 0 && (
              <span className="bg-[#718C56] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <button
                onClick={onResetFilters}
                className="text-xs font-semibold text-[#718C56] hover:underline flex items-center gap-1"
                title="Reset All Filters"
              >
                Reset
              </button>
            )}
            <button
              onClick={onClose}
              className="lg:hidden w-8 h-8 rounded-full bg-[#252B28] hover:bg-[#343C37] flex items-center justify-center text-[#E4E8E5] transition-colors"
              aria-label="Close filters"
            >
              <IconX className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 1. CATEGORIES */}
        <div className="mb-6">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#AFB8B0] mb-3 flex items-center gap-1.5">
            <IconTag className="w-3.5 h-3.5 text-[#718C56]" /> Categories
          </h3>
          <div className="flex flex-col gap-1.5">
            {categories.map((cat) => {
              const isSelected = category === cat;
              const count = productCountsByCategory[cat] || 0;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isSelected
                      ? "bg-[#718C56] text-white shadow-md shadow-[#718C56]/20 font-bold"
                      : "bg-[#252B28]/60 hover:bg-[#252B28] text-[#E4E8E5]/80 hover:text-[#E4E8E5]"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                      isSelected ? "bg-white/25 text-white" : "bg-black/5 text-[#AFB8B0]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. DIETARY & SPECIAL TAGS */}
        <div className="mb-6">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#AFB8B0] mb-3 flex items-center gap-1.5">
            <IconFlame className="w-3.5 h-3.5 text-[#718C56]" /> Highlights & Diet
          </h3>
          <div className="flex flex-col gap-2">
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#252B28]/60 hover:bg-[#252B28] cursor-pointer transition-colors">
              <span className="text-xs font-medium text-[#E4E8E5] flex items-center gap-2">
                <span>🔥</span> Bestsellers Only
              </span>
              <input
                type="checkbox"
                checked={onlyBestseller}
                onChange={(e) => setOnlyBestseller(e.target.checked)}
                className="w-4 h-4 rounded text-[#718C56] focus:ring-[#718C56] accent-[#718C56]"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#252B28]/60 hover:bg-[#252B28] cursor-pointer transition-colors">
              <span className="text-xs font-medium text-[#E4E8E5] flex items-center gap-2">
                <span>🌶️</span> Spicy Bites Only
              </span>
              <input
                type="checkbox"
                checked={onlySpicy}
                onChange={(e) => setOnlySpicy(e.target.checked)}
                className="w-4 h-4 rounded text-[#718C56] focus:ring-[#718C56] accent-[#718C56]"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#252B28]/60 hover:bg-[#252B28] cursor-pointer transition-colors">
              <span className="text-xs font-medium text-[#E4E8E5] flex items-center gap-2">
                <span>🥬</span> Vegetarian Friendly
              </span>
              <input
                type="checkbox"
                checked={onlyVeg}
                onChange={(e) => setOnlyVeg(e.target.checked)}
                className="w-4 h-4 rounded text-[#718C56] focus:ring-[#718C56] accent-[#718C56]"
              />
            </label>
          </div>
        </div>

        {/* 3. PRICE RANGE */}
        <div className="mb-6">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#AFB8B0] mb-3">
            Price Range
          </h3>
          <div className="flex flex-col gap-1.5">
            {priceOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setPrice(opt.value)}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  price === opt.value
                    ? "bg-[#171B19] text-white font-bold shadow"
                    : "text-[#E4E8E5]/70 hover:bg-[#252B28] hover:text-[#E4E8E5]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. RATING FILTER */}
        <div className="mb-6">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#AFB8B0] mb-3">
            Customer Rating
          </h3>
          <div className="flex flex-col gap-1.5">
            {ratingOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setRating(opt.value)}
                className={`w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  rating === opt.value
                    ? "bg-[#C5E879]/20 text-[#E4E8E5] border border-[#C5E879] font-bold"
                    : "text-[#E4E8E5]/70 hover:bg-[#252B28] hover:text-[#E4E8E5]"
                }`}
              >
                <IconStar className="w-3.5 h-3.5 text-[#C5E879]" />
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile bottom apply button */}
        <div className="lg:hidden pt-4 border-t border-[#E4E8E5]/10 mt-6">
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#718C56] text-white font-bold rounded-xl text-sm shadow-lg shadow-[#718C56]/30"
          >
            Show Dishes
          </button>
        </div>
      </aside>
    </>
  );
}
