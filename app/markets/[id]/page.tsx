"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector, selectAllMarkets, selectMarketsLoading } from "@/lib/redux/hooks";
import { fetchMarkets } from "@/lib/redux/slices/marketsSlice";
import Navbar from "@/components/Navbar";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { TrendingUp, Clock, ShieldCheck, Wallet, ArrowLeft, Share2, Bookmark } from "lucide-react";
import Link from "next/link";

export default function MarketDetail() {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    
    // Redux state
    const allMarkets = useAppSelector(selectAllMarkets);
    const loading = useAppSelector(selectMarketsLoading);
    
    const [market, setMarket] = useState<any>(null);
    const [betAmount, setBetAmount] = useState("");
    const [selectedOutcome, setSelectedOutcome] = useState<"Yes" | "No">("Yes");
    const [placingBet, setPlacingBet] = useState(false);
    const [message, setMessage] = useState("");
    const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");

    // Fetch markets if not already loaded
    useEffect(() => {
        if (allMarkets.length === 0) {
            dispatch(fetchMarkets());
        }
    }, [dispatch, allMarkets.length]);

    // Set market from Redux data
    useEffect(() => {
        if (allMarkets.length > 0) {
            const found = allMarkets.find((m: any) => m.id.toString() === id);
            setMarket(found);
        }
    }, [allMarkets, id]);

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
                
                // Dispatch Redux events to refresh data
                dispatch(fetchMarkets());
                window.dispatchEvent(new Event("poly_balance_updated"));
            } else {
                setMessage(data.error || "Failed to place bet. Try logging in.");
            }
        } catch (err) {
            setMessage("Connection error.");
        } finally {
            setPlacingBet(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-white"><Navbar /></div>;
    if (!market) return <div className="min-h-screen bg-white flex items-center justify-center font-bold">Market not found</div>;

    const noProbability = 100 - market.yes_probability;

    // Calculate estimated winnings
    const calculateEstimatedWinnings = () => {
        if (!betAmount || isNaN(Number(betAmount))) return 0;
        const amount = Number(betAmount);
        const probability = selectedOutcome === "Yes" ? market.yes_probability : noProbability;
        // Estimated winnings = amount * (probability/100)
        // This represents the payout if they win
        return (amount * probability) / 100;
    };

    const estimatedWinnings = calculateEstimatedWinnings();

    return (
        <div className="min-h-screen bg-white pb-20 md:pb-8 font-sans">
            <Navbar />

            <main className="mx-auto pt-20 md:pt-24 max-w-7xl px-4 md:px-6">
                {/* Back Button */}
                <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-black mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Link>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column - Market Info */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Market Header */}
                        <div>
                            <div className="flex items-start gap-4 mb-4">
                                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-200">
                                    <img src={market.image_url} alt="" className="h-full w-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{market.category}</span>
                                    <h1 className="text-2xl md:text-3xl font-bold text-black mt-1">{market.question}</h1>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <button className="flex items-center gap-2 hover:text-black transition">
                                    <Share2 className="h-4 w-4" />
                                    Share
                                </button>
                                <button className="flex items-center gap-2 hover:text-black transition">
                                    <Bookmark className="h-4 w-4" />
                                    Save
                                </button>
                            </div>
                        </div>

                        {/* Probability Display */}
                        <div className="bg-gray-50 rounded-2xl p-6">
                            <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4">Options</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                        <span className="font-semibold text-black">{market.question.split('?')[0].includes('Will') ? 'Yes' : 'True'}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-400" style={{width: `${market.yes_probability}%`}}></div>
                                        </div>
                                        <span className="font-bold text-lg text-black">{market.yes_probability}%</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                        <span className="font-semibold text-black">No</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-red-400" style={{width: `${noProbability}%`}}></div>
                                        </div>
                                        <span className="font-bold text-lg text-black">{noProbability}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <span className="text-xs font-bold text-gray-600 uppercase">Volume</span>
                                <div className="text-xl font-bold text-black mt-1">{market.volume}</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <span className="text-xs font-bold text-gray-600 uppercase">Closes</span>
                                <div className="text-sm font-bold text-black mt-1">{market.end_date}</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <span className="text-xs font-bold text-gray-600 uppercase">Status</span>
                                <div className="text-sm font-bold text-green-600 mt-1">Open</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Betting Interface */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 h-fit sticky top-24">
                        {/* Outcome Selector */}
                        <div className="space-y-3 mb-6">
                            <button
                                onClick={() => setSelectedOutcome("Yes")}
                                className={`w-full p-4 rounded-xl font-bold transition-all ${
                                    selectedOutcome === "Yes"
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-100 text-black hover:bg-gray-200"
                                }`}
                            >
                                Yes {market.yes_probability}¢
                            </button>
                            <button
                                onClick={() => setSelectedOutcome("No")}
                                className={`w-full p-4 rounded-xl font-bold transition-all ${
                                    selectedOutcome === "No"
                                        ? "bg-red-500 text-white"
                                        : "bg-gray-100 text-black hover:bg-gray-200"
                                }`}
                            >
                                No {noProbability}¢
                            </button>
                        </div>

                        {/* Buy/Sell Tabs */}
                        <div className="flex gap-2 mb-6 border-b border-gray-200">
                            <button
                                onClick={() => setActiveTab("buy")}
                                className={`flex-1 py-3 font-bold text-sm transition-colors ${
                                    activeTab === "buy"
                                        ? "text-black border-b-2 border-black -mb-[2px]"
                                        : "text-gray-600"
                                }`}
                            >
                                Buy
                            </button>
                            <button
                                onClick={() => setActiveTab("sell")}
                                className={`flex-1 py-3 font-bold text-sm transition-colors ${
                                    activeTab === "sell"
                                        ? "text-black border-b-2 border-black -mb-[2px]"
                                        : "text-gray-600"
                                }`}
                            >
                                Sell
                            </button>
                        </div>

                        {/* Amount Input */}
                        <div className="mb-4">
                            <label className="text-xs font-bold text-gray-600 uppercase block mb-2">Amount</label>
                            <div className="relative mb-3">
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={betAmount}
                                    onChange={(e) => setBetAmount(e.target.value)}
                                    className="w-full text-3xl font-bold text-right p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">¢</span>
                            </div>
                            <span className="text-xs text-gray-600">KSh. 0.00</span>
                        </div>

                        {/* Quick Select Buttons */}
                        <div className="mb-6">
                            <div className="text-xs font-bold text-gray-600 uppercase mb-2">KSh.</div>
                            <div className="grid grid-cols-5 gap-2">
                                <button onClick={() => setBetAmount("100")} className="text-xs font-bold bg-gray-100 hover:bg-gray-200 p-2 rounded">100</button>
                                <button onClick={() => setBetAmount("500")} className="text-xs font-bold bg-gray-100 hover:bg-gray-200 p-2 rounded">500</button>
                                <button onClick={() => setBetAmount("1000")} className="text-xs font-bold bg-gray-100 hover:bg-gray-200 p-2 rounded">1000</button>
                                <button onClick={() => setBetAmount("5000")} className="text-xs font-bold bg-gray-100 hover:bg-gray-200 p-2 rounded">5,000</button>
                                <button onClick={() => setBetAmount("10000")} className="text-xs font-bold bg-gray-100 hover:bg-gray-200 p-2 rounded">10,000</button>
                            </div>
                        </div>

                        {/* Estimated Winnings */}
                        {betAmount && !isNaN(Number(betAmount)) && Number(betAmount) > 0 && (
                            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-6 border border-green-200">
                                <span className="text-xs font-bold text-gray-600 uppercase block mb-2">To Win</span>
                                <div className="text-3xl font-bold text-green-600">
                                    KSh {estimatedWinnings.toFixed(2)}
                                </div>
                                <span className="text-xs text-gray-600 mt-1 block">
                                    Avg. Price {selectedOutcome === "Yes" ? market.yes_probability : noProbability}¢
                                </span>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={() => handleBet(selectedOutcome)}
                                disabled={placingBet}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50"
                            >
                                {activeTab === "buy" ? "Buy " : "Sell "} {selectedOutcome}
                            </button>
                            <button className="w-full bg-gray-200 hover:bg-gray-300 text-black font-bold py-3 rounded-lg transition-all">
                                Deposit
                            </button>
                        </div>

                        {/* Message */}
                        {message && (
                            <div className={`mt-4 p-3 rounded-lg text-sm font-bold text-center ${
                                message.includes('Success')
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                {message}
                            </div>
                        )}

                        {/* Terms */}
                        <p className="text-xs text-gray-600 text-center mt-4">
                            By trading, you agree to the{" "}
                            <a href="#" className="underline hover:text-black">Terms of Use</a>.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
