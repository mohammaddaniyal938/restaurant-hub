import { IconRotateCcw } from "./Icons";

export default function EmptyState({ onReset, onSelectCategory }) {
  const quickPills = ["Burgers", "Shawarma", "Pizza", "Sides"];

  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-white rounded-3xl border border-[#1C1715]/10 p-8 shadow-sm">
      <div className="w-20 h-20 rounded-full bg-[#FFF1EC] text-[#E4572E] flex items-center justify-center text-4xl mb-4 stamp-badge">
        🍽️
      </div>

      <h3 className="font-display font-extrabold text-xl sm:text-2xl text-[#1C1715] mb-2">
        No Sizzling Dishes Match Your Filter
      </h3>

      <p className="text-xs sm:text-sm text-[#665C54] max-w-sm mb-6 leading-relaxed font-normal">
        Try clearing your search keyword, adjusting your price range, or explore our popular categories below.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        {quickPills.map((pill) => (
          <button
            key={pill}
            onClick={() => onSelectCategory(pill)}
            className="px-3.5 py-1.5 rounded-full bg-[#F7F2EB] hover:bg-[#E4572E] text-[#1C1715] hover:text-white text-xs font-bold transition-all shadow-sm"
          >
            {pill}
          </button>
        ))}
      </div>

      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 bg-[#E4572E] hover:bg-[#D1451C] text-white px-6 py-3 rounded-full text-xs sm:text-sm font-extrabold shadow-lg shadow-[#E4572E]/30 active:scale-95 transition-all"
      >
        <IconRotateCcw className="w-4 h-4" />
        <span>Reset All Filters</span>
      </button>
    </div>
  );
}