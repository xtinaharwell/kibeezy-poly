"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { ArrowLeft } from "lucide-react";

export default function Withdraw() {
    const [user, setUser] = useState<any>(null);
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const checkAuth = async () => {
            const storedUser = localStorage.getItem("poly_user");
            if (!storedUser) {
                window.location.href = "/login";
                return;
            }

            try {
                const response = await fetch("http://127.0.0.1:8000/api/auth/check/", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                } else {
                    window.location.href = "/login";
                }
            } catch {
                const parsed = JSON.parse(storedUser);
                setUser(parsed);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const handleWithdraw = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            setError("Please enter a valid amount");
            return;
        }

        if (parseFloat(amount) > parseFloat(user.balance)) {
            setError("Insufficient balance");
            return;
        }

        setSubmitting(true);
        setError("");
        setSuccess("");

        try {
            const response = await fetch("http://127.0.0.1:8000/api/markets/withdraw/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ amount: parseFloat(amount) }),
            });

            if (response.ok) {
                const data = await response.json();
                setSuccess(`Withdrawal initiated! Request ID: ${data.transaction_id}`);
                setAmount("");
                // Refresh user balance
                setTimeout(() => {
                    window.location.href = "/dashboard";
                }, 2000);
            } else {
                const data = await response.json();
                setError(data.error || "Withdrawal failed");
            }
        } catch (err) {
            setError("Connection error");
            console.error(err);
        } finally {
            setSubmitting(false);
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

    if (!user) {
        return (
            <div className="min-h-screen bg-[#fbfbfd]">
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6">
                    <div className="apple-card w-full max-w-[400px] p-8 text-center">
                        <h1 className="text-2xl font-bold text-black mb-3">Please Log In</h1>
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
                <div className="max-w-[400px] mx-auto">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Link
                            href="/dashboard"
                            className="p-2 hover:bg-muted rounded-full transition-all"
                        >
                            <ArrowLeft className="h-6 w-6" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-black">Withdraw</h1>
                            <p className="text-muted-foreground">Cash out your balance</p>
                        </div>
                    </div>

                    {/* Balance Display */}
                    <div className="apple-card p-6 mb-6">
                        <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider mb-2">Available Balance</p>
                        <p className="text-4xl font-bold text-black">KSH {parseFloat(user.balance).toFixed(2)}</p>
                    </div>

                    {/* Withdrawal Form */}
                    <div className="apple-card p-6">
                        <h2 className="text-xl font-bold text-black mb-6">Withdrawal Details</h2>

                        {error && (
                            <div className="bg-apple-red/10 border border-apple-red/30 rounded-lg p-4 mb-4">
                                <p className="text-sm text-apple-red font-bold">{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="bg-apple-green/10 border border-apple-green/30 rounded-lg p-4 mb-4">
                                <p className="text-sm text-apple-green font-bold">{success}</p>
                                <p className="text-xs text-apple-green/70 mt-1">Redirecting to dashboard...</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-black mb-2">Withdrawal Amount</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3 text-muted-foreground font-bold">KSH</span>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        disabled={submitting}
                                        className="w-full pl-14 pr-4 py-3 border border-border rounded-lg text-black font-bold focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">Max: KSH {parseFloat(user.balance).toFixed(2)}</p>
                            </div>

                            <button
                                onClick={() => setAmount(user.balance)}
                                className="text-sm text-blue-500 font-bold hover:underline"
                            >
                                Use Maximum
                            </button>

                            {/* Quick amounts */}
                            <div className="grid grid-cols-3 gap-2">
                                {[100, 500, 1000].map((amt) => (
                                    <button
                                        key={amt}
                                        onClick={() => setAmount(amt.toString())}
                                        disabled={submitting || amt > parseFloat(user.balance)}
                                        className="px-3 py-2 border border-border rounded-lg text-sm font-bold hover:bg-muted transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        KSH {amt}
                                    </button>
                                ))}
                            </div>

                            <div className="border-t border-border pt-4">
                                <p className="text-xs text-muted-foreground mb-1">Note: Withdrawals are processed to your M-Pesa number</p>
                                <p className="text-xs text-muted-foreground">Processing time: 1-5 minutes</p>
                            </div>

                            <button
                                onClick={handleWithdraw}
                                disabled={submitting || !amount}
                                className="w-full h-12 bg-black text-white rounded-full font-bold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {submitting ? (
                                    <>
                                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Processing...
                                    </>
                                ) : (
                                    "Withdraw"
                                )}
                            </button>

                            <Link
                                href="/dashboard"
                                className="w-full h-12 bg-muted text-black rounded-full flex items-center justify-center font-bold transition-all hover:bg-[#e8e8ed]"
                            >
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
