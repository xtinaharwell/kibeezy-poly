"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { TrendingUp, Clock, ShieldCheck, Wallet, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MarketDetail() {
    const { id } = useParams();
    const [market, setMarket] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [betAmount, setBetAmount] = useState("");
    const [placingBet, setPlacingBet] = useState(false);
    const [message, setMessage] = useState("");

    const fetchMarket = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/markets/`);
            const data = await response.json();
            const found = data.find((m: any) => m.id.toString() === id);
            setMarket(found);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMarket();
    }, [id]);

    const handleBet = async (outcome: "Yes" | "No") => {
        if (!betAmount || isNaN(Number(betAmount))) {
            setMessage("Please enter a valid amount");
            return;
        }

        // Check if user is logged in first
        const user = localStorage.getItem("poly_user");
        if (!user) {
            setMessage("Please log in to place a bet");
            return;
        }

        setPlacingBet(true);
        setMessage("");

        try {
            const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/markets/bet/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    market_id: id,
                    outcome,
                    amount: betAmount,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(`Success! Placed a ${outcome} bet of KSh ${betAmount}`);
                setBetAmount("");
                fetchMarket(); // Refresh probability
            } else {
                setMessage(data.error || "Failed to place bet. Try logging in.");
            }
        } catch (err) {
            setMessage("Connection error.");
        } finally {
            setPlacingBet(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-[#fbfbfd]"><Navbar /></div>;
    if (!market) return <div className="min-h-screen bg-[#fbfbfd] flex items-center justify-center font-bold">Market not found</div>;

    return (
        <div className="min-h-screen bg-[#fbfbfd] pb-20 md:pb-32 font-sans overflow-x-hidden">
            <Navbar />

            <main className="mx-auto pt-24 md:pt-32 max-w-[800px] px-4 md:px-6">
                <Link href="/" className="flex items-center gap-2 text-[12px] md:text-sm font-bold text-muted-foreground hover:text-black mb-6 md:mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Markets
                </Link>

                {/* Market Info Card */}
                <div className="apple-card p-6 md:p-10 mb-6 md:mb-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start md:gap-6 mb-6 md:mb-8 text-center md:text-left">
                        <div className="h-16 w-16 md:h-20 md:w-20 shrink-0 overflow-hidden rounded-[20px] md:rounded-[24px] bg-muted shadow-sm mb-4 md:mb-0">
                            <img src={market.image_url} alt="" className="h-full w-full object-cover" />
                        </div>
                        <div>
                            <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-apple-blue mb-1 md:mb-2 block">
                                {market.category}
                            </span>
                            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-black leading-tight">
                                {market.question}
                            </h1>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 md:gap-12 py-6 md:py-8 border-y border-border mb-6">
                        <div className="space-y-1">
                            <span className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-wider">Yes Probability</span>
                            <div className="text-2xl md:text-4xl font-extrabold text-apple-green">{market.yes_probability}%</div>
                        </div>
                        <div className="space-y-1 text-right">
                            <span className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-wider">Volume</span>
                            <div className="text-2xl md:text-4xl font-extrabold text-black">{market.volume}</div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] md:text-sm font-bold text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 opacity-50" />
                            <span>Closes {market.end_date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-apple-blue" />
                            <span>Verified by Poly Oracle</span>
                        </div>
                    </div>
                </div>

                {/* Betting Card */}
                <div className="apple-card p-6 md:p-10 mb-10">
                    <h2 className="text-lg md:text-xl font-bold mb-6">Place your prediction</h2>

                    <div className="mb-6">
                        <label className="text-[10px] md:text-[11px] font-bold text-muted-foreground uppercase tracking-wider ml-1 mb-2 block">Amount (KSh)</label>
                        <div className="relative">
                            <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="number"
                                placeholder="0.00"
                                value={betAmount}
                                onChange={(e) => setBetAmount(e.target.value)}
                                className="h-12 md:h-14 w-full rounded-2xl bg-muted pl-11 pr-4 text-md md:text-lg font-bold focus:outline-none focus:ring-1 focus:ring-black transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6">
                        <button
                            onClick={() => handleBet("Yes")}
                            disabled={placingBet}
                            className="rounded-2xl bg-black py-3.5 md:py-4 text-[13px] md:text-sm font-bold text-white transition-opacity hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                        >
                            Predict YES
                        </button>
                        <button
                            onClick={() => handleBet("No")}
                            disabled={placingBet}
                            className="rounded-2xl bg-muted py-3.5 md:py-4 text-[13px] md:text-sm font-bold text-black transition-all hover:bg-[#e8e8ed] active:scale-[0.98] disabled:opacity-50"
                        >
                            Predict NO
                        </button>
                    </div>

                    {message && (
                        <div className={`p-3 md:p-4 rounded-xl text-center text-[12px] md:text-sm font-bold ${message.includes('Success') ? 'bg-apple-green/10 text-apple-green' : 'bg-apple-red/10 text-apple-red'}`}>
                            {message}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
