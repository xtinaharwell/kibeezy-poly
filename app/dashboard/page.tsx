"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { ArrowLeft, Wallet, TrendingUp, Award, History, LogOut } from "lucide-react";

export default function Dashboard() {
    const [user, setUser] = useState<any>(null);
    const [statistics, setStatistics] = useState<any>(null);
    const [bets, setBets] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState<"overview" | "bets" | "history">("overview");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/markets/dashboard/", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                    setStatistics(data.statistics);
                    setBets(data.bets);
                } else if (response.status === 401) {
                    window.location.href = "/login";
                    return;
                } else {
                    setError("Failed to load dashboard");
                }

                // Load transaction history
                const historyResponse = await fetch("http://127.0.0.1:8000/api/markets/history/", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                });

                if (historyResponse.ok) {
                    const data = await historyResponse.json();
                    setTransactions(data.transactions);
                }
            } catch (err) {
                setError("Connection error");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("poly_user");
        window.location.href = "/login";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fbfbfd]">
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6">
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-12 w-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                        <p className="font-bold text-black text-lg">Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-[#fbfbfd]">
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6">
                    <div className="apple-card w-full max-w-[400px] p-8 text-center">
                        <h1 className="text-2xl font-bold text-black mb-3">Please Log In</h1>
                        <p className="text-muted-foreground mb-6">{error || "Unable to load dashboard"}</p>
                        <Link
                            href="/login"
                            className="w-full h-12 bg-black text-white rounded-full flex items-center justify-center font-bold transition-all hover:opacity-90"
                        >
                            Go to Login
                        </Link>
                    </div>
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
                            <h1 className="text-3xl md:text-4xl font-bold text-black">Dashboard</h1>
                            <p className="text-muted-foreground">Welcome back, {user.full_name}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:bg-muted transition-all"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </div>

                    {/* Balance Card */}
                    <div className="apple-card p-8 mb-8">
                        <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider mb-2">Total Balance</p>
                        <h2 className="text-5xl font-bold text-black mb-6">KSH {parseFloat(user.balance).toFixed(2)}</h2>
                        <div className="flex gap-4">
                            <Link
                                href="/deposit"
                                className="flex-1 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold transition-all hover:opacity-90"
                            >
                                <Wallet className="h-4 w-4 mr-2" />
                                Deposit
                            </Link>
                            <Link
                                href="/withdraw"
                                className="flex-1 h-12 bg-muted text-black rounded-full flex items-center justify-center font-bold transition-all hover:bg-[#e8e8ed]"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2 rotate-180" />
                                Withdraw
                            </Link>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="apple-card p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-muted-foreground text-sm font-bold uppercase mb-1">Total Wagered</p>
                                    <p className="text-2xl font-bold text-black">KSH {statistics.total_wagered.toFixed(2)}</p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-muted-foreground opacity-50" />
                            </div>
                        </div>
                        <div className="apple-card p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-muted-foreground text-sm font-bold uppercase mb-1">Wins</p>
                                    <p className="text-2xl font-bold text-apple-green">{statistics.wins}</p>
                                </div>
                                <Award className="h-8 w-8 text-apple-green opacity-50" />
                            </div>
                        </div>
                        <div className="apple-card p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-muted-foreground text-sm font-bold uppercase mb-1">Win Rate</p>
                                    <p className="text-2xl font-bold text-black">{statistics.win_rate}%</p>
                                </div>
                                <Wallet className="h-8 w-8 text-muted-foreground opacity-50" />
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="apple-card mb-8">
                        <div className="border-b border-border flex">
                            <button
                                onClick={() => setActiveTab("overview")}
                                className={`flex-1 px-6 py-4 font-bold transition-all ${
                                    activeTab === "overview"
                                        ? "text-black border-b-2 border-black"
                                        : "text-muted-foreground hover:text-black"
                                }`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab("bets")}
                                className={`flex-1 px-6 py-4 font-bold transition-all ${
                                    activeTab === "bets"
                                        ? "text-black border-b-2 border-black"
                                        : "text-muted-foreground hover:text-black"
                                }`}
                            >
                                Bets
                            </button>
                            <button
                                onClick={() => setActiveTab("history")}
                                className={`flex-1 px-6 py-4 font-bold transition-all ${
                                    activeTab === "history"
                                        ? "text-black border-b-2 border-black"
                                        : "text-muted-foreground hover:text-black"
                                }`}
                            >
                                History
                            </button>
                        </div>

                        {/* Overview Tab */}
                        {activeTab === "overview" && (
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="font-bold text-black mb-2">Account Info</h3>
                                        <p className="text-sm text-muted-foreground mb-1">Phone: {user.phone_number}</p>
                                        <p className="text-sm text-muted-foreground mb-1">Member since: {new Date(user.joined).toLocaleDateString()}</p>
                                        <p className="text-sm text-muted-foreground">KYC: {user.kyc_verified ? "Verified ✓" : "Not Verified"}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Bets Tab */}
                        {activeTab === "bets" && (
                            <div className="p-6">
                                {bets.length === 0 ? (
                                    <p className="text-muted-foreground text-center py-8">No bets yet</p>
                                ) : (
                                    <div className="space-y-4">
                                        {bets.map((bet) => (
                                            <div key={bet.id} className="border border-border rounded-lg p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <p className="font-bold text-black">{bet.market_question}</p>
                                                        <p className="text-sm text-muted-foreground">Prediction: {bet.outcome}</p>
                                                    </div>
                                                    <span
                                                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                                                            bet.result === "WON"
                                                                ? "bg-apple-green/10 text-apple-green"
                                                                : bet.result === "LOST"
                                                                ? "bg-apple-red/10 text-apple-red"
                                                                : "bg-muted text-muted-foreground"
                                                        }`}
                                                    >
                                                        {bet.result}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <p>Wagered: <span className="font-bold text-black">KSH {parseFloat(bet.amount).toFixed(2)}</span></p>
                                                    {bet.payout && <p>Payout: <span className="font-bold text-apple-green">KSH {parseFloat(bet.payout).toFixed(2)}</span></p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* History Tab */}
                        {activeTab === "history" && (
                            <div className="p-6">
                                {transactions.length === 0 ? (
                                    <p className="text-muted-foreground text-center py-8">No transaction history</p>
                                ) : (
                                    <div className="space-y-3">
                                        {transactions.map((txn) => (
                                            <div key={txn.id} className="flex justify-between items-center py-3 border-b border-border last:border-b-0">
                                                <div>
                                                    <p className="text-sm font-bold text-black">{txn.type}</p>
                                                    <p className="text-xs text-muted-foreground">{new Date(txn.created_at).toLocaleDateString()} {new Date(txn.created_at).toLocaleTimeString()}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`font-bold ${txn.type === "DEPOSIT" || txn.type === "PAYOUT" ? "text-apple-green" : "text-black"}`}>
                                                        {txn.type === "DEPOSIT" || txn.type === "PAYOUT" ? "+" : "-"}KSH {parseFloat(txn.amount).toFixed(2)}
                                                    </p>
                                                    <p className={`text-xs ${
                                                        txn.status === "COMPLETED" ? "text-apple-green" :
                                                        txn.status === "FAILED" ? "text-apple-red" :
                                                        "text-muted-foreground"
                                                    }`}>
                                                        {txn.status}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
