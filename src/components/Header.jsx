import { useState } from "react";
import {
  IconSearch,
  IconCart,
  IconHeart,
  IconMapPin,
  IconFilter,
  IconHistory,
  IconX,
  IconFlame,
  IconChevronDown,
  IconDashboard,
} from "./Icons";

const KARACHI_AREAS = [
  "Clifton, Karachi",
  "DHA Phase 5 & 6",
  "Gulshan-e-Iqbal",
  "PECHS Block 2 & 6",
  "North Nazimabad",
  "Bahadurabad",
  "Gulistan-e-Johar",
  "Malir Cantt",
];

export default function Header({
  search,
  setSearch,
  cartCount,
  cartTotal,
  favoritesCount,
  onCartClick,
  onFavoritesClick,
  onHistoryClick,
  onFiltersClick,
  onOpenDashboard,
  activeOrdersCount = 0,
  selectedArea,
  setSelectedArea,
  currentPage = "home",
  onNavigate,
  authUser = null,
  isStaff = false,
  onSignIn,
  onSignOut,
}) {
  const [areaDropdownOpen, setAreaDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const searchSuggestions = ["Beef Burger", "Zinger", "Shawarma", "Fajita Pizza", "Loaded Fries"];

  return (
    <>
      {/* TOP ANNOUNCEMENT BANNER */}
      <div className="bg-[#E4572E] text-white text-xs font-semibold py-1.5 px-4 overflow-hidden relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar whitespace-nowrap">
            <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">
              Flash Deal
            </span>
            <span>Use code <strong className="underline decoration-wavy">KARACHI20</strong> for 20% OFF!</span>
            <span className="hidden sm:inline opacity-70">•</span>
            <span className="hidden sm:inline">🚀 Free Delivery on orders over Rs. 1500</span>
            <span className="hidden md:inline opacity-70">•</span>
            <span className="hidden md:inline">🕒 Avg. Delivery: 25-35 mins</span>
          </div>

          <div className="hidden lg:flex items-center gap-4 text-xs text-white/90 shrink-0 ml-4">
            <span className="flex items-center gap-1">
              <IconFlame className="w-3.5 h-3.5 text-yellow-300" /> 100% Halal Fresh
            </span>

            {authUser ? (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-white/90 max-w-[160px] truncate">
                  {authUser.email}
                </span>
                <button
                  onClick={onSignOut}
                  className="bg-black/30 hover:bg-black/50 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full transition-colors"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={onSignIn}
                className="bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full transition-colors"
              >
                Sign in
              </button>
            )}

            <button
              onClick={onOpenDashboard}
              className="bg-black/30 hover:bg-black/50 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 transition-colors"
            >
              <IconDashboard className="w-3 h-3 text-[#F5A623]" />
              <span>{isStaff ? "Restaurant Dashboard" : "Staff Login"}</span>
              {activeOrdersCount > 0 && (
                <span className="bg-amber-400 text-black px-1 rounded-full text-[9px] font-black">
                  {activeOrdersCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MAIN HEADER */}
      <header className="sticky top-0 z-40 glass-header border-b border-white/10 text-white shadow-xl shadow-black/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between gap-2 md:gap-6">
          
          {/* LEFT: Mobile Filters Trigger & Brand */}
          <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
            <button
              onClick={onFiltersClick}
              className="lg:hidden w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Open Filters"
              title="Filters & Menu"
            >
              <IconFilter className="w-4 h-4" />
            </button>

            {/* BRAND LOGO */}
            <button onClick={() => onNavigate?.("home")} className="flex items-center gap-2 group text-left">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#E4572E] flex items-center justify-center text-xl shadow-lg shadow-[#E4572E]/30 group-hover:scale-105 transition-transform">
                🍔
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-lg sm:text-2xl tracking-tight leading-none text-white">
                  Karachi<span className="text-[#E4572E]">Bites</span>
                </span>
                <span className="text-[10px] text-white/60 tracking-wider font-semibold uppercase">
                  Fast Food & Grill
                </span>
              </div>
            </button>
          </div>

          <nav className="hidden lg:flex items-center gap-1 shrink-0" aria-label="Main navigation">
            <button onClick={() => onNavigate?.("home")} className={`px-3 py-2 rounded-full text-xs font-bold transition-colors ${currentPage === "home" ? "bg-white/15 text-white" : "text-white/60 hover:text-white"}`}>Home</button>
            <button onClick={() => onNavigate?.("menu")} className={`px-3 py-2 rounded-full text-xs font-bold transition-colors ${currentPage === "menu" ? "bg-[#E4572E] text-white" : "text-white/60 hover:text-white"}`}>Menu</button>
          </nav>

          {/* LOCATION SELECTOR (Desktop & Tablet) */}
          <div className="hidden md:block relative shrink-0">
            <button
              onClick={() => setAreaDropdownOpen(!areaDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white/90 transition-all"
            >
              <IconMapPin className="w-3.5 h-3.5 text-[#E4572E]" />
              <div className="text-left">
                <p className="text-[10px] text-white/50 leading-none">Deliver to</p>
                <p className="font-semibold text-white truncate max-w-[120px]">{selectedArea}</p>
              </div>
              <IconChevronDown className="w-3 h-3 text-white/50" />
            </button>

            {areaDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setAreaDropdownOpen(false)}
                />
                <div className="absolute left-0 mt-2 w-52 rounded-2xl bg-[#231F1C] border border-white/10 shadow-2xl p-2 z-20 animate-pop-in">
                  <p className="px-3 py-1.5 text-[11px] font-bold text-white/40 uppercase tracking-wider">
                    Select Karachi Zone
                  </p>
                  {KARACHI_AREAS.map((area) => (
                    <button
                      key={area}
                      onClick={() => {
                        setSelectedArea(area);
                        setAreaDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                        selectedArea === area
                          ? "bg-[#E4572E] text-white font-semibold"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span>{area}</span>
                      {selectedArea === area && <span>✓</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* SEARCH BAR */}
          <div className="flex-1 min-w-0 max-w-md relative">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
                <IconSearch className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                placeholder="Search burgers, shawarmas, pizzas..."
                className="w-full bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-[#1C1715] placeholder:text-white/50 focus:placeholder:text-[#1C1715]/40 rounded-full pl-9 pr-9 py-2 text-xs sm:text-sm font-medium border border-white/10 focus:border-[#E4572E] focus:outline-none transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white focus:text-black p-1"
                  aria-label="Clear search"
                >
                  <IconX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick search suggestions popup */}
            {searchFocused && !search && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#231F1C] border border-white/10 rounded-2xl p-3 shadow-2xl z-30 animate-pop-in">
                <p className="text-[11px] font-bold text-white/40 uppercase tracking-wider mb-2">
                  Popular Searches
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {searchSuggestions.map((item) => (
                    <button
                      key={item}
                      onMouseDown={() => setSearch(item)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#E4572E] text-white/80 hover:text-white text-xs transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT ACTIONS: Dashboard, Wishlist, History, Cart */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Dashboard button for tablet/desktop */}
            <button
              onClick={onOpenDashboard}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/5 hover:bg-[#E4572E] text-white/90 hover:text-white border border-white/10 text-xs font-bold transition-all"
              title="Admin Dashboard"
            >
              <IconDashboard className="w-4 h-4 text-[#F5A623]" />
              <span className="hidden lg:inline">Dashboard</span>
              {activeOrdersCount > 0 && (
                <span className="bg-[#E4572E] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {activeOrdersCount}
                </span>
              )}
            </button>

            {/* Order History */}
            <button
              onClick={onHistoryClick}
              className="hidden sm:flex w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white items-center justify-center transition-colors"
              title="Order History"
              aria-label="Order History"
            >
              <IconHistory className="w-4 h-4 text-white/80" />
            </button>

            {/* Favorites Wishlist */}
            <button
              onClick={onFavoritesClick}
              className="relative w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white flex items-center justify-center transition-colors"
              title="Saved Favorites"
              aria-label="Saved Favorites"
            >
              <IconHeart className={`w-4 h-4 ${favoritesCount > 0 ? "text-[#E4572E] fill-current" : "text-white/80"}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E4572E] text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* CART BUTTON */}
            <button
              onClick={onCartClick}
              className="relative flex items-center gap-2 bg-[#E4572E] hover:bg-[#D1451C] text-white px-3.5 sm:px-4 py-2 rounded-full font-bold text-xs sm:text-sm shadow-lg shadow-[#E4572E]/30 active:scale-95 transition-all"
              aria-label="View Cart"
            >
              <div className="relative">
                <IconCart className="w-4 h-4 sm:w-5 sm:h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-[#F5A623] text-[#161311] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-none">
                <span className="text-[10px] text-white/80 uppercase font-semibold">Cart</span>
                <span className="font-extrabold text-xs">Rs. {cartTotal.toLocaleString()}</span>
              </div>
            </button>
          </div>

        </div>
      </header>
    </>
  );
}