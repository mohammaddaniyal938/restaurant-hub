import { IconFlame, IconClock, IconShieldCheck, IconStar, IconArrowRight, IconSparkles } from "./Icons";

export default function HeroBanner({ onSelectCategory, onClaimFeaturedDeal }) {
  return (
    <div className="relative bg-gradient-to-b from-[#161311] via-[#231F1C] to-[#FFFDF9] text-white pt-8 pb-10 sm:pt-12 sm:pb-14 px-4 sm:px-6 md:px-8 overflow-hidden">
      {/* Decorative ambient glow background */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E4572E]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-12 -left-12 w-80 h-80 bg-[#F5A623]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* LEFT: Hero Copy & Trust Badges */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            {/* Tag badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md mb-4 animate-fade-in">
              <span className="flex h-2 w-2 rounded-full bg-[#E4572E] animate-ping" />
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <IconFlame className="w-3.5 h-3.5 text-[#E4572E]" /> Karachi's #1 Fast Food Craving
              </span>
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-5xl xl:text-6xl text-white tracking-tight leading-[1.1] mb-4">
              Sizzling Gourmet Bites, <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-[#E4572E] via-[#F5A623] to-[#FFD700] bg-clip-text text-transparent">
                Delivered Piping Hot.
              </span>
            </h1>

            <p className="text-white/70 text-sm sm:text-base max-w-xl mb-6 leading-relaxed font-normal">
              Indulge in charcoal-grilled beef smash burgers, authentic Lebanese toum shawarmas, cheesy loaded fries, and handcrafted artisan pizzas across Karachi.
            </p>

            <button
              onClick={() => onSelectCategory?.("All")}
              className="inline-flex items-center gap-2 bg-[#E4572E] hover:bg-[#D1451C] text-white font-extrabold text-sm px-5 py-3 rounded-full shadow-lg shadow-[#E4572E]/30 active:scale-95 transition-all mb-7"
            >
              Explore the full menu <IconArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Action Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full max-w-lg">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-2.5 sm:p-3 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-xl bg-[#E4572E]/20 text-[#E4572E] flex items-center justify-center shrink-0">
                  <IconClock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-white/50 uppercase font-bold">Express</p>
                  <p className="text-xs sm:text-sm font-bold text-white">30 Min Delivery</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-2.5 sm:p-3 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-xl bg-[#2E8B57]/20 text-[#2E8B57] flex items-center justify-center shrink-0">
                  <IconShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-white/50 uppercase font-bold">Quality</p>
                  <p className="text-xs sm:text-sm font-bold text-white">100% Halal</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-2.5 sm:p-3 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-xl bg-[#F5A623]/20 text-[#F5A623] flex items-center justify-center shrink-0">
                  <IconStar className="w-4 h-4 text-[#F5A623]" />
                </div>
                <div>
                  <p className="text-[10px] text-white/50 uppercase font-bold">Rating</p>
                  <p className="text-xs sm:text-sm font-bold text-white">4.9 (15k+ Reviews)</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Featured Hot Deal Card */}
          <div className="lg:col-span-5 z-10">
            <div className="relative rounded-3xl bg-gradient-to-br from-[#2A2420] to-[#1C1715] border border-white/15 p-5 sm:p-6 shadow-2xl shadow-black/40 overflow-hidden group">
              {/* Deal tag */}
              <div className="absolute top-4 right-4 bg-[#E4572E] text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                25% OFF COMBO
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-[#F5A623] mb-2">
                <IconSparkles className="w-4 h-4" /> Today's Karachi Highlight
              </div>

              <h2 className="font-display font-bold text-xl sm:text-2xl text-white mb-2">
                Karachi Midnight Due Feast
              </h2>

              <p className="text-xs text-white/70 mb-4 line-clamp-2">
                2x Sizzling Burgers (Classic Beef or Crispy Zinger), 1x Large Dynamite Loaded Fries & 2x Soft Drinks.
              </p>

              <div className="flex items-center justify-between gap-4 mt-auto pt-2 border-t border-white/10">
                <div>
                  <span className="text-xs text-white/40 line-through mr-2 font-medium">Rs. 2,499</span>
                  <span className="font-display font-extrabold text-2xl text-[#E4572E]">Rs. 1,899</span>
                </div>

                <button
                  onClick={onClaimFeaturedDeal}
                  className="inline-flex items-center gap-2 bg-[#E4572E] hover:bg-[#D1451C] text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-lg shadow-[#E4572E]/30 active:scale-95 transition-all"
                >
                  <span>Quick Add</span>
                  <IconArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
