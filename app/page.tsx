"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import MarketCard from "@/components/MarketCard";

const categories = ["All", "Politics", "Sports", "Crypto", "Economy", "Environment"];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
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

  const filteredMarkets = activeCategory === "All"
    ? markets
    : markets.filter(m => m.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#fbfbfd] font-sans pb-32">
      <Navbar />

      <main className="mx-auto pt-24 md:pt-32 max-w-[1200px] px-4 md:px-6">
        {/* Header Section */}
        <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
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

      <footer className="mt-24 md:mt-40 border-t border-border bg-white py-12 md:py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="text-xl md:text-2xl font-bold tracking-tighter mb-8 md:mb-12">
            poly.co.ke
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-[12px] md:text-sm">
            <div className="flex flex-col gap-3 md:gap-4">
              <span className="font-bold">Platform</span>
              <a href="#" className="text-muted-foreground hover:text-black">Markets</a>
              <a href="#" className="text-muted-foreground hover:text-black">Activity</a>
              <a href="#" className="text-muted-foreground hover:text-black">Leaderboard</a>
            </div>
            <div className="flex flex-col gap-3 md:gap-4">
              <span className="font-bold">Company</span>
              <a href="#" className="text-muted-foreground hover:text-black">About</a>
              <a href="#" className="text-muted-foreground hover:text-black">Blog</a>
              <a href="#" className="text-muted-foreground hover:text-black">Careers</a>
            </div>
            <div className="flex flex-col gap-3 md:gap-4">
              <span className="font-bold sm:block hidden">Support</span>
              <a href="#" className="text-muted-foreground hover:text-black sm:block hidden">Docs</a>
              <a href="#" className="text-muted-foreground hover:text-black sm:block hidden">Help Center</a>
              <a href="#" className="text-muted-foreground hover:text-black sm:block hidden">Contact</a>
            </div>
            <div className="flex flex-col gap-3 md:gap-4">
              <span className="font-bold sm:block hidden">Legal</span>
              <a href="#" className="text-muted-foreground hover:text-black sm:block hidden">Privacy</a>
              <a href="#" className="text-muted-foreground hover:text-black sm:block hidden">Terms</a>
              <a href="#" className="text-muted-foreground hover:text-black sm:block hidden">Disclaimer</a>
            </div>
          </div>
          <div className="mt-12 md:mt-20 pt-8 border-t border-border flex flex-col md:flex-row justify-between gap-4 text-[10px] md:text-xs font-medium text-muted-foreground">
            <p>© 2026 poly.co.ke. Designed for privacy and accuracy.</p>
            <div className="flex gap-4 md:gap-6">
              <span>Made in Nairobi</span>
              <span className="text-black">HQ: Westlands, Nairobi</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
