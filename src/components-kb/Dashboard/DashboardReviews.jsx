import { useState, useEffect } from "react";
import { supabaseService } from "../../services/supabaseService";
import { IconStar, IconTrash, IconSearch, IconCheckCircle } from "../Icons";

export default function DashboardReviews({ products = [], onShowToast }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [starFilter, setStarFilter] = useState(0);

  const loadReviews = async () => {
    setLoading(true);
    const data = await supabaseService.getReviews();
    setReviews(data || []);
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(loadReviews, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleDeleteReview = async (id) => {
    if (window.confirm("Are you sure you want to remove this customer review?")) {
      await supabaseService.deleteReview(id);
      setReviews((prev) => prev.filter((r) => String(r.id) !== String(id)));
      if (onShowToast) onShowToast("Review deleted");
    }
  };

  const filteredReviews = reviews.filter((r) => {
    const starMatch = starFilter === 0 || Math.floor(r.rating) === starFilter;
    let searchMatch = true;
    if (search.trim() !== "") {
      const q = search.trim().toLowerCase();
      searchMatch =
        r.username?.toLowerCase().includes(q) ||
        r.review?.toLowerCase().includes(q);
    }
    return starMatch && searchMatch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-[#1C1715]/10 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-xl text-[#1C1715]">
            Customer Reviews & Ratings Moderation
          </h2>
          <p className="text-xs text-[#665C54]">
            {filteredReviews.length} reviews found • Moderate testimonials across all dishes
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative w-full md:w-64">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#665C54]">
              <IconSearch className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reviewer or comment..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F7F2EB]/70 border border-[#1C1715]/10 text-xs font-medium focus:outline-none focus:border-[#E4572E]"
            />
          </div>

          <button
            onClick={loadReviews}
            className="bg-[#161311] hover:bg-[#E4572E] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shrink-0 shadow-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Star Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {[0, 5, 4, 3, 2, 1].map((s) => (
          <button
            key={s}
            onClick={() => setStarFilter(s)}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              starFilter === s
                ? "bg-[#E4572E] text-white shadow"
                : "bg-white text-[#1C1715]/70 hover:bg-[#F7F2EB] border border-[#1C1715]/10"
            }`}
          >
            <IconStar className={`w-3.5 h-3.5 ${starFilter === s ? "text-white fill-white" : "text-[#F5A623] fill-[#F5A623]"}`} />
            <span>{s === 0 ? "All Ratings" : `${s} Stars`}</span>
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 text-center py-12 text-xs text-[#665C54]">
            Loading customer reviews...
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-xs text-[#665C54]">
            No reviews match the selected filter.
          </div>
        ) : (
          filteredReviews.map((review) => {
            const product = products.find(
              (p) => String(p.id) === String(review.productid || review.product_id)
            );

            return (
              <div
                key={review.id}
                className="p-4 rounded-2xl bg-white border border-[#1C1715]/10 shadow-sm flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={review.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80"}
                        alt={review.username}
                        className="w-8 h-8 rounded-full object-cover bg-gray-100"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-[#1C1715] text-xs">
                            {review.username}
                          </p>
                          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                            <IconCheckCircle className="w-3 h-3" /> Verified
                          </span>
                        </div>
                        <p className="text-[10px] text-[#665C54]">
                          {review.date || "Verified Customer"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 font-bold text-xs text-[#F5A623] bg-[#FEF6E8] px-2 py-0.5 rounded-full">
                      <IconStar className="w-3.5 h-3.5 fill-[#F5A623]" />
                      <span>{review.rating}</span>
                    </div>
                  </div>

                  {product && (
                    <p className="text-[11px] text-[#E4572E] font-semibold mt-2">
                      Dish: {product.title}
                    </p>
                  )}

                  <p className="text-xs text-[#1C1715]/80 font-normal leading-relaxed mt-2 italic">
                    "{review.review}"
                  </p>
                </div>

                <div className="pt-2 border-t border-[#1C1715]/5 flex justify-end">
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <IconTrash className="w-3.5 h-3.5" />
                    <span>Delete Review</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
