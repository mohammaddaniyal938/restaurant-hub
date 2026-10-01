import { IconHeart, IconX, IconCart, IconPlus, IconTrash } from "./Icons";

export default function FavoritesDrawer({
  isOpen,
  onClose,
  favorites = [],
  onRemoveFavorite,
  onAddToCart,
  onAddAllFavorites,
}) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className="fixed top-0 right-0 z-50 h-screen w-full sm:w-[400px] bg-white flex flex-col shadow-2xl border-l border-[#1C1715]/10 animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1C1715]/10 bg-[#FFFDF9]">
          <div className="flex items-center gap-2">
            <IconHeart className="w-5 h-5 text-[#E4572E] fill-[#E4572E]" />
            <h2 className="font-display font-extrabold text-xl text-[#1C1715]">
              Saved Bites
            </h2>
            <span className="bg-[#FFF1EC] text-[#E4572E] text-xs font-bold px-2 py-0.5 rounded-full">
              {favorites.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F7F2EB] hover:bg-[#EDE4D8] flex items-center justify-center text-[#1C1715] transition-colors"
            aria-label="Close"
          >
            <IconX className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scroll-thin px-6 py-4">
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20">
              <div className="w-16 h-16 rounded-full bg-[#FFF1EC] flex items-center justify-center text-2xl mb-3">
                ❤️
              </div>
              <h3 className="font-display font-bold text-base text-[#1C1715] mb-1">
                No favorites saved yet
              </h3>
              <p className="text-xs text-[#665C54] max-w-xs mb-6 font-normal">
                Click the heart icon on any burger, shawarma, or pizza to save it here for fast ordering!
              </p>
              <button
                onClick={onClose}
                className="bg-[#E4572E] text-white text-xs font-bold px-5 py-2.5 rounded-full shadow"
              >
                Explore Menu
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {favorites.map((product) => (
                <div
                  key={product.id}
                  className="p-3.5 rounded-2xl bg-[#FFFDF9] border border-[#1C1715]/10 shadow-sm flex items-center gap-3"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded-xl shrink-0 bg-[#F7F2EB]"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display font-bold text-xs sm:text-sm text-[#1C1715] truncate">
                      {product.title}
                    </h4>
                    <p className="text-xs font-extrabold text-[#E4572E] mt-0.5">
                      Rs. {product.price.toLocaleString()}
                    </p>
                    <span className="text-[10px] text-[#665C54] bg-[#F7F2EB] px-2 py-0.5 rounded inline-block mt-1">
                      {product.category}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      onClick={() => onAddToCart(product, 1)}
                      className="bg-[#E4572E] hover:bg-[#D1451C] text-white p-2 rounded-xl transition-colors shadow-sm"
                      title="Add to cart"
                      aria-label="Add to cart"
                    >
                      <IconPlus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRemoveFavorite(product.id)}
                      className="text-[#665C54] hover:text-red-500 p-1 self-center transition-colors"
                      title="Remove"
                      aria-label="Remove favorite"
                    >
                      <IconTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        {favorites.length > 0 && (
          <div className="p-5 bg-[#FFFDF9] border-t border-[#1C1715]/10">
            <button
              onClick={onAddAllFavorites}
              className="w-full bg-[#161311] hover:bg-[#E4572E] text-white font-extrabold py-3.5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              <IconCart className="w-4 h-4" />
              <span>Add All ({favorites.length}) to Cart</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
