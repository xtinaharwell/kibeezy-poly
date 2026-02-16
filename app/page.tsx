"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import MarketCard from "@/components/MarketCard";
import { Search } from "lucide-react";

const categories = ["All", "Politics", "Sports", "Crypto", "Economy", "Environment"];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [markets, setMarkets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/markets/");
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
    const matchCategory = activeCategory === "All" || m.category === activeCategory;
    const matchSearch = m.question.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#fbfbfd] font-sans pb-32">
      <Navbar />

      <main className="mx-auto pt-24 md:pt-32 max-w-[1200px] px-4 md:px-6">
        {/* Search and Filter Section */}
        <div className="mb-8 md:mb-12 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search markets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 rounded-xl bg-white border border-border pl-12 pr-4 text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-black transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="relative group w-full overflow-hidden">
            {/* Gradient fade for scrolling categories */}
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#fbfbfd] to-transparent z-10 pointer-events-none md:hidden" />

            <div className="flex gap-2 p-1 bg-muted rounded-full w-full overflow-x-auto no-scrollbar scroll-smooth">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 md:px-6 py-2 rounded-full text-[11px] md:text-[12px] font-bold whitespace-nowrap transition-all ${activeCategory === cat
                    ? "bg-white text-black shadow-sm"
                    : "text-muted-foreground hover:text-black"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Section */}
        <div className="mb-6 md:mb-8 flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">Live Markets</h2>
          <button className="text-[12px] md:text-sm font-bold text-apple-blue hover:underline">See all activity</button>
        </div>

        {/* Markets Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 md:h-64 rounded-[22px] bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMarkets.length > 0 ? (
              filteredMarkets.map((market) => (
                <MarketCard key={market.id} market={market} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-muted-foreground font-medium">No live markets found in this category.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
