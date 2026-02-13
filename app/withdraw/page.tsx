"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpCircle, Smartphone, Info, ChevronRight, CheckCircle2 } from "lucide-react";

export default function WithdrawPage() {
    const [amount, setAmount] = useState("");
    const [step, setStep] = useState<"input" | "processing" | "success">("input");
    const balance = 2450.00; // Mock balance

    const handleWithdraw = (e: React.FormEvent) => {
        e.preventDefault();
        setStep("processing");
        // Simulate processing
        setTimeout(() => setStep("success"), 2500);
    };

    if (step === "processing") {
        return (
            <div className="min-h-screen bg-[#fbfbfd] flex flex-col items-center justify-center p-6 text-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 border-4 border-apple-red border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-bold text-black text-lg">Processing Withdrawal...</p>
                    <p className="text-muted-foreground text-sm max-w-[300px]">
                        We're verifying your request. This usually takes less than a minute.
                    </p>
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
                    <h1 className="text-3xl font-bold text-black mb-2">Request Sent</h1>
                    <p className="text-muted-foreground mb-8">
                        Your request to withdraw KSH {amount} to M-Pesa is being processed.
                    </p>
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
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-black">Withdraw Funds</h1>
                        <p className="text-muted-foreground font-medium">Transfer your winnings to your mobile wallet</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Balance Overview */}
                        <div className="apple-card p-6 md:p-8 bg-black text-white">
                            <p className="text-[11px] font-bold text-white/60 uppercase tracking-wider mb-2">Available for Withdrawal</p>
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">KSH {balance.toLocaleString()}</h2>
                        </div>

                        {/* Amount Input */}
                        <div className="apple-card p-6 md:p-8">
                            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-4">Withdrawal Amount (KSH)</label>
                            <div className="relative mb-8">
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="text-4xl md:text-5xl font-bold bg-transparent border-none focus:outline-none w-full placeholder:text-muted/30"
                                />
                                <button
                                    onClick={() => setAmount(balance.toString())}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 px-4 py-2 bg-muted text-black text-xs font-bold rounded-full hover:bg-[#e8e8ed] transition-all"
                                >
                                    MAX
                                </button>
                            </div>

                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-4">Destination</p>
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted border border-border">
                                <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-black shadow-sm">
                                    <Smartphone className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-black text-sm">M-Pesa Mobile Money</p>
                                    <p className="text-xs text-muted-foreground">Linked: 254712345678</p>
                                </div>
                            </div>
                        </div>

                        {/* Information Box */}
                        <div className="p-6 rounded-3xl bg-apple-blue/5 border border-apple-blue/10 flex gap-4">
                            <div className="h-10 w-10 rounded-full bg-apple-blue/10 flex items-center justify-center text-apple-blue shrink-0">
                                <Info className="h-5 w-5" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-bold text-black text-sm">Instant Withdrawals</p>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Most withdrawals are processed instantly. Large amounts may require manual verification for your security, which can take up to 24 hours.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="apple-card p-6 md:p-8 sticky top-24">
                            <h2 className="text-xl font-bold text-black mb-6">Confirm Request</h2>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground font-medium">Amount</span>
                                    <span className="text-black font-bold">KSH {amount || "0"}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground font-medium">Transaction Fee</span>
                                    <span className="text-apple-red font-bold">- KSH 15.00</span>
                                </div>
                                <div className="pt-4 border-t border-border flex justify-between items-center">
                                    <span className="text-black font-bold text-lg">You Receive</span>
                                    <span className="text-black font-bold text-2xl">KSH {amount ? (Math.max(0, parseFloat(amount) - 15)).toLocaleString() : "0"}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleWithdraw}
                                disabled={!amount || parseFloat(amount) < 50 || parseFloat(amount) > balance}
                                className="w-full h-14 bg-black text-white rounded-full flex items-center justify-center gap-2 font-bold transition-all hover:opacity-90 disabled:opacity-50"
                            >
                                <ArrowUpCircle className="h-5 w-5" />
                                Withdraw Now
                                <ChevronRight className="h-5 w-5" />
                            </button>

                            <p className="mt-6 text-[11px] text-muted-foreground text-center leading-relaxed font-medium">
                                Minimum withdrawal: KSH 50.00
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
