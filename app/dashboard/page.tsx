"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import DepositModal from "@/components/DepositModal";
import { useAuth } from "@/lib/useAuth";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { ArrowLeft, Wallet, TrendingUp, Award, History, LogOut, Search, Filter } from "lucide-react";

export default function Dashboard() {
    const { user: authUser, loading: authLoading } = useAuth("/dashboard");
    const [statistics, setStatistics] = useState<any>(null);
    const [bets, setBets] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState<"positions" | "open-orders" | "history">("positions");
    const [profitLossPeriod, setProfitLossPeriod] = useState<"1D" | "1W" | "1M" | "ALL">("1M");
    const [searchQuery, setSearchQuery] = useState("");
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

    useEffect(() => {
        if (authLoading) return;

        const loadDashboard = async () => {
            try {
                const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/markets/dashboard/`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (response.ok) {
                    const data = await response.json();
                    setStatistics(data.statistics);
                    setBets(data.bets || []);
                } else if (response.status === 401) {
                    localStorage.removeItem("poly_user");
                    localStorage.setItem("poly_redirect", "/dashboard");
                    window.location.href = "/login";
                    return;
                } else {
                    setError("Failed to load dashboard");
                }

                // Load transaction history
                const historyResponse = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/markets/history/`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (historyResponse.ok) {
                    const data = await historyResponse.json();
                    setTransactions(data.transactions || []);
                }
            } catch (err) {
                setError("Connection error");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, [authLoading]);

    const handleLogout = () => {
        localStorage.removeItem("poly_user");
        window.location.href = "/login";
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-[#fbfbfd]">
                <Navbar />
                <main className="mx-auto pt-24 max-w-[1200px] px-4">
                    <div className="space-y-4">
                        <div className="h-32 bg-muted rounded-lg animate-pulse" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="h-24 bg-muted rounded-lg animate-pulse" />
                            <div className="h-24 bg-muted rounded-lg animate-pulse" />
                            <div className="h-24 bg-muted rounded-lg animate-pulse" />
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (error || !authUser) {
        return (
            <div className="min-h-screen bg-[#fbfbfd]">
                <Navbar />
                <main className="mx-auto pt-24 max-w-[1200px] px-4 text-center">
                    <p className="text-red-500 mb-4">{error || "Failed to load dashboard"}</p>
                    <Link href="/login" className="text-apple-blue hover:underline">
                        Return to login
                    </Link>
                </main>
            </div>
        );
    }

    const user = authUser;

    return (
        <div className="min-h-screen bg-[#fbfbfd] pb-20">
            <Navbar />

            <main className="mx-auto pt-24 max-w-[1200px] px-4 md:px-6">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 hover:bg-muted rounded-lg transition">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">Welcome, {user.full_name}</h1>
                            <p className="text-muted-foreground text-sm">{user.phone_number}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </button>
                </div>

                {/* Portfolio & Profit/Loss Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Portfolio Card */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl p-6 border border-gray-200">
                            <div className="grid grid-cols-2 gap-6">
                                {/* Left: Portfolio */}
                                <div>
                                    <p className="text-muted-foreground text-sm font-medium mb-1">Portfolio</p>
                                    <h2 className="text-3xl font-bold mb-1">KSh {parseFloat(user.balance).toLocaleString()}</h2>
                                    <p className="text-xs text-muted-foreground mb-6">{statistics?.total_wagered > 0 ? `+${parseFloat(statistics.total_wagered).toLocaleString()}` : '0.00'} (0%) past day</p>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setIsDepositModalOpen(true)}
                                            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm"
                                        >
                                            <Wallet className="h-4 w-4" />
                                            Deposit
                                        </button>
                                        <button
                                            onClick={() => setIsWithdrawModalOpen(true)}
                                            className="flex-1 px-4 py-3 border border-gray-300 text-black rounded-lg font-semibold hover:bg-gray-50 transition text-sm"
                                        >
                                            Withdraw
                                        </button>
                                    </div>
                                </div>

                                {/* Right: Available to Trade */}
                                <div className="border-l border-gray-200 pl-6">
                                    <p className="text-muted-foreground text-sm font-medium mb-1">Available to trade</p>
                                    <h2 className="text-3xl font-bold">KSh {parseFloat(user.balance).toLocaleString()}</h2>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profit/Loss Card */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-muted-foreground text-sm font-medium">Profit/Loss</p>
                                <h2 className="text-3xl font-bold text-gray-900">KSh 0.00</h2>
                            </div>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-4">Past {profitLossPeriod.toLowerCase()}</p>
                        
                        {/* Time Period Filters */}
                        <div className="flex gap-2">
                            {["1D", "1W", "1M", "ALL"].map((period) => (
                                <button
                                    key={period}
                                    onClick={() => setProfitLossPeriod(period as any)}
                                    className={`px-3 py-1 rounded text-xs font-medium transition ${
                                        profitLossPeriod === period
                                            ? "bg-blue-100 text-blue-600"
                                            : "bg-gray-100 text-muted-foreground hover:bg-gray-200"
                                    }`}
                                >
                                    {period}
                                </button>
                            ))}
                        </div>

                        {/* Placeholder Chart */}
                        <div className="mt-4 h-20 bg-gradient-to-r from-blue-50 to-transparent rounded-lg" />
                    </div>
                </div>

                {/* Positions Tabs & Table */}
                <div className="bg-white rounded-2xl border border-gray-200">
                    {/* Tabs & Search */}
                    <div className="border-b border-gray-200 p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                            {/* Tabs */}
                            <div className="flex gap-6">
                                {["positions", "open-orders", "history"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab as any)}
                                        className={`pb-2 font-semibold text-sm transition-colors border-b-2 ${
                                            activeTab === tab
                                                ? "border-black text-black"
                                                : "border-transparent text-muted-foreground hover:text-black"
                                        }`}
                                    >
                                        {tab.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                                    </button>
                                ))}
                            </div>

                            {/* Filter Button */}
                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
                                <Filter className="h-4 w-4" />
                                Current value
                            </button>
                        </div>

                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 text-sm"
                            />
                        </div>
                    </div>

                    {/* Table Content */}
                    <div className="p-6">
                        {activeTab === "positions" && (
                            <div>
                                {bets.filter(b => b.market_question?.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">MARKET</th>
                                                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">AVG → NOW</th>
                                                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">BET</th>
                                                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">TO WIN</th>
                                                    <th className="text-right py-3 px-4 font-semibold text-muted-foreground">VALUE</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {bets.filter(b => !searchQuery || b.market_question?.toLowerCase().includes(searchQuery.toLowerCase())).map((bet) => (
                                                    <tr key={bet.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                                        <td className="py-4 px-4">
                                                            <div>
                                                                <p className="font-medium text-sm truncate max-w-xs">{bet.market_question}</p>
                                                                <p className="text-xs text-muted-foreground mt-1">{bet.outcome}</p>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-4 text-sm">
                                                            <span className="text-muted-foreground">0% → 0%</span>
                                                        </td>
                                                        <td className="py-4 px-4 text-sm font-medium">
                                                            KSh {parseFloat(bet.amount).toLocaleString()}
                                                        </td>
                                                        <td className="py-4 px-4 text-sm">
                                                            <span className="text-green-600 font-medium">
                                                                {bet.payout ? `KSh ${parseFloat(bet.payout).toLocaleString()}` : "—"}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-4 text-right">
                                                            <div>
                                                                <p className="font-medium text-sm">
                                                                    {bet.payout ? `+KSh ${(parseFloat(bet.payout) - parseFloat(bet.amount)).toLocaleString()}` : "—"}
                                                                </p>
                                                                <p className={`text-xs ${
                                                                    bet.result === 'WON'
                                                                        ? 'text-green-600'
                                                                        : bet.result === 'LOST'
                                                                        ? 'text-red-600'
                                                                        : 'text-muted-foreground'
                                                                }`}>
                                                                    {bet.result}
                                                                </p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="py-12 text-center">
                                        <p className="text-muted-foreground">No positions found.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "open-orders" && (
                            <div className="py-12 text-center">
                                <p className="text-muted-foreground">No open orders</p>
                            </div>
                        )}

                        {activeTab === "history" && (
                            <div>
                                {transactions.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">TYPE</th>
                                                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">DESCRIPTION</th>
                                                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">AMOUNT</th>
                                                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">STATUS</th>
                                                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">DATE</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {transactions.map((txn) => (
                                                    <tr key={txn.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                                        <td className="py-4 px-4">
                                                            <span className={`text-xs font-semibold px-2 py-1 rounded ${
                                                                txn.type === 'DEPOSIT'
                                                                    ? 'bg-green-50 text-green-700'
                                                                    : 'bg-red-50 text-red-700'
                                                            }`}>
                                                                {txn.type}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-4 text-sm">{txn.description}</td>
                                                        <td className="py-4 px-4 text-sm font-medium">
                                                            <span className={txn.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'}>
                                                                {txn.type === 'DEPOSIT' ? '+' : '-'} KSh {parseFloat(txn.amount).toLocaleString()}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <span className={`text-xs font-medium px-2 py-1 rounded ${
                                                                txn.status === 'COMPLETED'
                                                                    ? 'bg-green-50 text-green-700'
                                                                    : txn.status === 'PENDING'
                                                                    ? 'bg-yellow-50 text-yellow-700'
                                                                    : 'bg-red-50 text-red-700'
                                                            }`}>
                                                                {txn.status}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-4 text-sm text-muted-foreground">
                                                            {new Date(txn.created_at).toLocaleDateString()}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="py-12 text-center">
                                        <p className="text-muted-foreground">No transaction history</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Deposit Modal */}
            <DepositModal
                isOpen={isDepositModalOpen}
                onClose={() => setIsDepositModalOpen(false)}
                balance={authUser?.balance || "0.00"}
            />

            {/* Withdraw Modal */}
            {isWithdrawModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsWithdrawModalOpen(false)} />
                    <div className="relative bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl">
                        <button
                            onClick={() => setIsWithdrawModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-black transition"
                        >
                            ✕
                        </button>
                        
                        <h2 className="text-2xl font-bold mb-2">Withdraw</h2>
                        <p className="text-muted-foreground mb-6">Enter amount to withdraw</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2">Amount (KSh)</label>
                                <input
                                    type="number"
                                    placeholder="Enter amount"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 text-lg"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                {[500, 1000, 5000].map((amount) => (
                                    <button
                                        key={amount}
                                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold transition"
                                    >
                                        KSh {amount.toLocaleString()}
                                    </button>
                                ))}
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-xs text-muted-foreground mb-1">M-Pesa</p>
                                <p className="font-semibold text-sm">{authUser?.phone_number}</p>
                            </div>

                            <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                                Withdraw
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
