"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import MarketCard from "@/components/MarketCard";
import { Search, Sliders } from "lucide-react";

const categories = ["Trending", "Breaking", "New", "Politics", "Sports", "Crypto"];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("Trending");
  const [searchQuery, setSearchQuery] = useState("");
  const [markets, setMarkets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/markets/`);
        const data = await response.json();
        setMarkets(data);
      } catch (err) {
        console.error("Failed to fetch markets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarkets();
  }, []);

  const filteredMarkets = markets.filter(m => {
    const matchCategory = activeCategory === "Trending" || m.category === activeCategory;
    const matchSearch = m.question.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-gray-900">
      <Navbar />

      {/* Sticky Search & Category Section */}
      <div className="sticky top-16 sm:top-14 md:top-12 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-sm">
        {/* Search Bar */}
        <div className="px-5 sm:px-6 py-4 border-b border-gray-100">
          <div className="relative flex items-center gap-2 max-w-3xl mx-auto">
            <Search className="absolute left-4 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search markets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 h-11 rounded-xl bg-gray-100 pl-10 pr-4 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all"
            />
            <button
              className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors text-gray-500 hover:text-gray-900"
              aria-label="Filters"
            >
              <Sliders className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-1.5 px-5 sm:px-6 py-3 overflow-x-auto no-scrollbar max-w-3xl mx-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-full transition-all ${
                activeCategory === cat
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-5 sm:px-6 py-8 sm:py-10 pb-24 sm:pb-0">
        {/* Markets Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-40 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMarkets.length > 0 ? (
              filteredMarkets.map((market) => (
                <MarketCard key={market.id} market={market} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-gray-400 text-lg">No markets found in this category.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}