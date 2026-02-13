"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Wallet, Smartphone, CreditCard, ChevronRight, CheckCircle2 } from "lucide-react";

const PRESET_AMOUNTS = [500, 1000, 2000, 5000];

export default function DepositPage() {
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState<"mpesa" | "card">("mpesa");
    const [step, setStep] = useState<"input" | "processing" | "success">("input");
    const [error, setError] = useState("");

    const handleDeposit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStep("processing");
        setError("");

        try {
            const response = await fetch("http://127.0.0.1:8000/api/payments/stk-push/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount }),
                credentials: "include",
            });

            const data = await response.json();
            if (response.ok) {
                // We keep it in processing step, usually in a real app 
                // we would poll the backend for transaction status.
                // For this demo, we'll wait 3 seconds then show success.
                setTimeout(() => setStep("success"), 3000);
            } else {
                setStep("input");
                setError(data.error || "Failed to initiate STK Push");
            }
        } catch (err) {
            setStep("input");
            setError("Connection error. Is the backend running?");
        }
    };

    if (step === "processing") {
        return (
            <div className="min-h-screen bg-[#fbfbfd] flex flex-col items-center justify-center p-6">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-bold text-black text-lg">Processing Deposit...</p>
                    <p className="text-muted-foreground text-sm">Please check your phone for the M-Pesa prompt.</p>
                </div>
            </div>
        );
    }

    if (step === "success") {
        return (
            <div className="min-h-screen bg-[#fbfbfd] flex flex-col items-center justify-center p-6 text-center">
                <div className="apple-card w-full max-w-[440px] p-8 flex flex-col items-center">
                    <div className="h-20 w-20 bg-apple-green/10 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="h-10 w-10 text-apple-green" />
                    </div>
                    <h1 className="text-3xl font-bold text-black mb-2">Deposit Successful</h1>
                    <p className="text-muted-foreground mb-8">KSH {amount} has been added to your balance.</p>
                    <Link
                        href="/"
                        className="w-full h-12 bg-black text-white rounded-full flex items-center justify-center font-bold transition-all hover:opacity-90"
                    >
                        Back to Markets
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fbfbfd] pt-24 pb-12 px-4">
            <div className="max-w-[1000px] mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href="/"
                        className="h-10 w-10 bg-white border border-border rounded-full flex items-center justify-center text-black transition-all hover:bg-muted"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-black">Deposit Funds</h1>
                        <p className="text-muted-foreground font-medium">Add balance to start predicting</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Amount Selection */}
                        <div className="apple-card p-6 md:p-8">
                            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-4">Enter Amount (KSH)</label>
                            <input
                                type="number"
                                placeholder="Min. 10"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="text-4xl md:text-5xl font-bold bg-transparent border-none focus:outline-none w-full placeholder:text-muted/30 mb-8"
                            />

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {PRESET_AMOUNTS.map((a) => (
                                    <button
                                        key={a}
                                        onClick={() => setAmount(a.toString())}
                                        className={`h-12 rounded-2xl font-bold text-sm transition-all ${amount === a.toString()
                                            ? "bg-black text-white"
                                            : "bg-muted text-black hover:bg-[#e8e8ed]"
                                            }`}
                                    >
                                        +{a}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="apple-card p-6 md:p-8">
                            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-4">Payment Method</label>
                            <div className="space-y-3">
                                <button
                                    onClick={() => setMethod("mpesa")}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${method === "mpesa"
                                        ? "border-black bg-black/5"
                                        : "border-border bg-white hover:border-black/20"
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${method === "mpesa" ? "bg-black text-white" : "bg-muted text-black"}`}>
                                            <Smartphone className="h-6 w-6" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-black">M-Pesa Express</p>
                                            <p className="text-xs text-muted-foreground">Instant STK Push</p>
                                        </div>
                                    </div>
                                    {method === "mpesa" && <div className="h-5 w-5 bg-black rounded-full flex items-center justify-center"><div className="h-2 w-2 bg-white rounded-full"></div></div>}
                                </button>

                                <button
                                    onClick={() => setMethod("card")}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${method === "card"
                                        ? "border-black bg-black/5"
                                        : "border-border bg-white hover:border-black/20"
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${method === "card" ? "bg-black text-white" : "bg-muted text-black"}`}>
                                            <CreditCard className="h-6 w-6" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-black">Credit / Debit Card</p>
                                            <p className="text-xs text-muted-foreground">Visa, Mastercard</p>
                                        </div>
                                    </div>
                                    {method === "card" && <div className="h-5 w-5 bg-black rounded-full flex items-center justify-center"><div className="h-2 w-2 bg-white rounded-full"></div></div>}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="apple-card p-6 md:p-8 sticky top-24">
                            <h2 className="text-xl font-bold text-black mb-6">Summary</h2>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground font-medium">Deposit Amount</span>
                                    <span className="text-black font-bold">KSH {amount || "0"}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground font-medium">Fees</span>
                                    <span className="text-black font-bold">KSH 0</span>
                                </div>
                                <div className="pt-4 border-t border-border flex justify-between items-center">
                                    <span className="text-black font-bold text-lg">Total</span>
                                    <span className="text-black font-bold text-2xl">KSH {amount || "0"}</span>
                                </div>
                            </div>

                            {error && <p className="text-xs font-bold text-apple-red text-center mb-4">{error}</p>}
                            <button
                                onClick={handleDeposit}
                                disabled={!amount || parseInt(amount) < 10}
                                className="w-full h-14 bg-black text-white rounded-full flex items-center justify-center gap-2 font-bold transition-all hover:opacity-90 disabled:opacity-50"
                            >
                                <Wallet className="h-5 w-5" />
                                Deposit Now
                                <ChevronRight className="h-5 w-5" />
                            </button>

                            <p className="mt-6 text-[11px] text-muted-foreground text-center leading-relaxed">
                                Secure payments processed by Flutterwave.<br />
                                By depositing, you agree to our Terms of Service.
                            </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-apple-blue/5 border border-apple-blue/10">
                            <p className="text-xs text-apple-blue font-semibold leading-relaxed">
                                Need help with your deposit? Contact our 24/7 support via WhatsApp.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
