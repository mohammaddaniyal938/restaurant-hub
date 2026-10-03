import { IconRotateCcw } from "./Icons";

export default function EmptyState({ onReset, onSelectCategory }) {
  const quickPills = ["Burgers", "Shawarma", "Pizza", "Sides"];

  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-[#252B28] rounded-3xl border border-[#E4E8E5]/10 p-8 shadow-sm">
      <div className="w-20 h-20 rounded-full bg-[#303A2B] text-[#718C56] flex items-center justify-center text-4xl mb-4 stamp-badge">
        🍽️
      </div>

      <h3 className="font-display font-extrabold text-xl sm:text-2xl text-[#E4E8E5] mb-2">
        No Sizzling Dishes Match Your Filter
      </h3>

      <p className="text-xs sm:text-sm text-[#AFB8B0] max-w-sm mb-6 leading-relaxed font-normal">
        Try clearing your search keyword, adjusting your price range, or explore our popular
        categories below.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        {quickPills.map((pill) => (
          <button
            key={pill}
            onClick={() => onSelectCategory(pill)}
            className="px-3.5 py-1.5 rounded-full bg-[#252B28] hover:bg-[#718C56] text-[#E4E8E5] hover:text-white text-xs font-bold transition-all shadow-sm"
          >
            {pill}
          </button>
        ))}
      </div>

      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 bg-[#718C56] hover:bg-[#607A46] text-white px-6 py-3 rounded-full text-xs sm:text-sm font-extrabold shadow-lg shadow-[#718C56]/30 active:scale-95 transition-all"
      >
        <IconRotateCcw className="w-4 h-4" />
        <span>Reset All Filters</span>
      </button>
    </div>
  );
}
