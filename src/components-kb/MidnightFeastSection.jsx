import { IconArrowRight, IconClock, IconSparkles } from "./Icons";

export default function MidnightFeastSection({ onClaimDeal }) {
  return (
    <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 py-8 sm:py-10">
      <div className="relative overflow-hidden rounded-[2rem] bg-[#231F1C] text-white shadow-2xl shadow-[#161311]/15">
        <div className="grid lg:grid-cols-2 items-stretch">
          <div className="relative min-h-[280px] lg:min-h-[360px] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&q=85"
              alt="Stacked burgers fresh from the grill"
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager"
              onError={(event) => {
                event.currentTarget.src = "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&q=85";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/10 to-[#231F1C]/90 lg:bg-gradient-to-r lg:from-transparent lg:via-[#231F1C]/15 lg:to-[#231F1C]" />
            <span className="absolute top-5 left-5 inline-flex items-center gap-1.5 rounded-full bg-[#F5A623] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#161311] shadow-lg">
              <IconSparkles className="w-3.5 h-3.5" /> After-dark special
            </span>
          </div>

          <div className="relative flex flex-col justify-center px-6 py-8 sm:px-10 lg:-ml-10 lg:py-10">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#F5A623]">
              <IconClock className="w-4 h-4" /> Served until 4:00 AM
            </p>
            <h2 className="font-display mt-3 text-3xl sm:text-4xl font-extrabold leading-tight text-white">
              Karachi Midnight Due Feast
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/70">
              When the city gets hungry after dark, bring home a table full of smoky burgers, crispy sides, and ice-cold drinks made for sharing.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
              <button
                onClick={onClaimDeal}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#E4572E] px-5 py-3 text-xs font-extrabold text-white shadow-lg shadow-[#E4572E]/25 transition-all hover:bg-[#D1451C] active:scale-95"
              >
                Taste the midnight menu <IconArrowRight className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold text-white/50">Free delivery over Rs. 1,500</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
