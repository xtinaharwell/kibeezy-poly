"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Plus, Edit2, CheckCircle, XCircle, Loader } from "lucide-react";

export default function AdminPanel() {
    const [markets, setMarkets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState<"markets" | "create">("markets");
    const [selectedMarket, setSelectedMarket] = useState<any>(null);
    const [resolvingMarket, setResolvingMarket] = useState<string | null>(null);
    const [outcome, setOutcome] = useState<"Yes" | "No" | "">();

    // Create market form
    const [createForm, setCreateForm] = useState({
        question: "",
        description: "",
        endDate: "",
    });

    useEffect(() => {
        loadMarkets();
    }, []);

    const loadMarkets = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/markets/admin/markets/", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                setMarkets(data.markets);
            } else if (response.status === 401) {
                window.location.href = "/login";
            } else {
                setError("Failed to load markets");
            }
        } catch (err) {
            setError("Connection error");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateMarket = async () => {
        if (!createForm.question || !createForm.description) {
            setError("Please fill all fields");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/api/markets/admin/create/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(createForm),
            });

            if (response.ok) {
                setCreateForm({ question: "", description: "", endDate: "" });
                setActiveTab("markets");
                await loadMarkets();
            } else {
                const data = await response.json();
                setError(data.error || "Failed to create market");
            }
        } catch (err) {
            setError("Connection error");
            console.error(err);
        }
    };

    const handleResolveMarket = async (marketId: string, marketOutcome: "Yes" | "No") => {
        setResolvingMarket(marketId);

        try {
            const response = await fetch("http://127.0.0.1:8000/api/markets/admin/resolve/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    market_id: marketId,
                    outcome: marketOutcome,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                // Update market status locally
                setMarkets(markets.map((m) => 
                    m.id === marketId ? { ...m, status: "RESOLVED", resolved_outcome: marketOutcome } : m
                ));
                setSelectedMarket(null);
                setOutcome("");
            } else {
                const data = await response.json();
                setError(data.error || "Failed to resolve market");
            }
        } catch (err) {
            setError("Connection error");
            console.error(err);
        } finally {
            setResolvingMarket(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fbfbfd]">
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6">
                    <div className="h-12 w-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fbfbfd] pb-12">
            <Navbar />
            <div className="pt-24 px-4">
                <div className="max-w-[1200px] mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-black">Admin Panel</h1>
                            <p className="text-muted-foreground">Manage markets and resolutions</p>
                        </div>
                        <Link
                            href="/"
                            className="px-4 py-2 rounded-full border border-border hover:bg-muted transition-all"
                        >
                            Back to Markets
                        </Link>
                    </div>

                    {error && (
                        <div className="bg-apple-red/10 border border-apple-red/30 rounded-lg p-4 mb-6">
                            <p className="text-sm text-apple-red font-bold">{error}</p>
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="apple-card mb-8">
                        <div className="border-b border-border flex">
                            <button
                                onClick={() => setActiveTab("markets")}
                                className={`flex-1 px-6 py-4 font-bold transition-all ${
                                    activeTab === "markets"
                                        ? "text-black border-b-2 border-black"
                                        : "text-muted-foreground hover:text-black"
                                }`}
                            >
                                Markets ({markets.length})
                            </button>
                            <button
                                onClick={() => setActiveTab("create")}
                                className={`flex-1 px-6 py-4 font-bold transition-all flex items-center justify-center gap-2 ${
                                    activeTab === "create"
                                        ? "text-black border-b-2 border-black"
                                        : "text-muted-foreground hover:text-black"
                                }`}
                            >
                                <Plus className="h-4 w-4" />
                                Create Market
                            </button>
                        </div>

                        {/* Markets Tab */}
                        {activeTab === "markets" && (
                            <div className="p-6">
                                {markets.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-muted-foreground mb-4">No markets yet</p>
                                        <button
                                            onClick={() => setActiveTab("create")}
                                            className="px-4 py-2 bg-black text-white rounded-full font-bold transition-all hover:opacity-90"
                                        >
                                            Create First Market
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {markets.map((market) => (
                                            <div key={market.id} className="border border-border rounded-lg p-4">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-bold text-black">{market.question}</h3>
                                                        <p className="text-sm text-muted-foreground">{market.description}</p>
                                                    </div>
                                                    <span
                                                        className={`text-xs font-bold px-3 py-1 rounded-full ml-4 white-space-nowrap ${
                                                            market.status === "OPEN"
                                                                ? "bg-apple-blue/10 text-apple-blue"
                                                                : market.status === "CLOSED"
                                                                ? "bg-amber-500/10 text-amber-500"
                                                                : "bg-apple-green/10 text-apple-green"
                                                        }`}
                                                    >
                                                        {market.status}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-3 gap-4 mb-4 py-3 border-y border-border">
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Total Bets</p>
                                                        <p className="text-lg font-bold text-black">{market.total_bets}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Winners</p>
                                                        <p className="text-lg font-bold text-apple-green">{market.winners}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Losers</p>
                                                        <p className="text-lg font-bold text-apple-red">{market.losers}</p>
                                                    </div>
                                                </div>

                                                {market.status === "RESOLVED" && market.resolved_outcome && (
                                                    <div className="mb-4 p-3 bg-apple-green/5 border border-apple-green/20 rounded">
                                                        <p className="text-xs text-muted-foreground mb-1">Resolved Outcome</p>
                                                        <p className="font-bold text-black">{market.resolved_outcome}</p>
                                                    </div>
                                                )}

                                                {market.status === "OPEN" && (
                                                    <button
                                                        onClick={() => setSelectedMarket(market)}
                                                        className="w-full px-4 py-2 bg-black text-white rounded-lg font-bold transition-all hover:opacity-90"
                                                    >
                                                        Resolve Market
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Create Market Tab */}
                        {activeTab === "create" && (
                            <div className="p-6 max-w-[500px]">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-black mb-2">Market Question</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Will BTC reach KSh 5M by Dec 31?"
                                            value={createForm.question}
                                            onChange={(e) =>
                                                setCreateForm({ ...createForm, question: e.target.value })
                                            }
                                            className="w-full px-4 py-3 border border-border rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-black"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-black mb-2">Description</label>
                                        <textarea
                                            placeholder="Add more context about this market..."
                                            value={createForm.description}
                                            onChange={(e) =>
                                                setCreateForm({ ...createForm, description: e.target.value })
                                            }
                                            className="w-full px-4 py-3 border border-border rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-black resize-none"
                                            rows={4}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-black mb-2">End Date (Optional)</label>
                                        <input
                                            type="date"
                                            value={createForm.endDate}
                                            onChange={(e) =>
                                                setCreateForm({ ...createForm, endDate: e.target.value })
                                            }
                                            className="w-full px-4 py-3 border border-border rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-black"
                                        />
                                    </div>

                                    <button
                                        onClick={handleCreateMarket}
                                        className="w-full h-12 bg-black text-white rounded-full font-bold transition-all hover:opacity-90"
                                    >
                                        Create Market
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Resolution Modal */}
            {selectedMarket && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="apple-card w-full max-w-[400px] p-6">
                        <h2 className="text-xl font-bold text-black mb-2">Resolve Market</h2>
                        <p className="text-muted-foreground text-sm mb-6">{selectedMarket.question}</p>

                        <div className="space-y-3 mb-6">
                            <button
                                onClick={() => {
                                    setOutcome("Yes");
                                    handleResolveMarket(selectedMarket.id, "Yes");
                                }}
                                disabled={resolvingMarket !== null}
                                className="w-full px-4 py-3 border-2 border-apple-green rounded-lg text-black font-bold hover:bg-apple-green/10 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {resolvingMarket === selectedMarket.id && outcome === "Yes" && (
                                    <Loader className="h-4 w-4 animate-spin" />
                                )}
                                <CheckCircle className="h-5 w-5 text-apple-green" />
                                Outcome: Yes
                            </button>
                            <button
                                onClick={() => {
                                    setOutcome("No");
                                    handleResolveMarket(selectedMarket.id, "No");
                                }}
                                disabled={resolvingMarket !== null}
                                className="w-full px-4 py-3 border-2 border-apple-red rounded-lg text-black font-bold hover:bg-apple-red/10 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {resolvingMarket === selectedMarket.id && outcome === "No" && (
                                    <Loader className="h-4 w-4 animate-spin" />
                                )}
                                <XCircle className="h-5 w-5 text-apple-red" />
                                Outcome: No
                            </button>
                        </div>

                        <button
                            onClick={() => {
                                setSelectedMarket(null);
                                setOutcome("");
                            }}
                            disabled={resolvingMarket !== null}
                            className="w-full px-4 py-3 border border-border rounded-lg text-black font-bold hover:bg-muted transition-all disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
