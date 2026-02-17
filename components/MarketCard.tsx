"use client";

import { TrendingUp, Bookmark } from "lucide-react";
import Link from "next/link";

interface MarketCardProps {
    market: {
        id: number;
        question: string;
        category: string;
        image_url: string;
        yes_probability: number;
        volume: string;
        end_date: string;
        is_live: boolean;
    };
}

export default function MarketCard({ market }: MarketCardProps) {
    const noProbability = 100 - market.yes_probability;

    return (
        <>
            {/* Mobile List View */}
            <Link
                href={`/markets/${market.id}`}
                className="block md:hidden border-b border-gray-300 bg-gradient-to-br from-white to-gray-50/50 p-4 hover:bg-gradient-to-br hover:from-white hover:to-gray-100 transition-all active:bg-gray-100"
            >
                <div className="space-y-3">
                    {/* Header */}
                    <div className="flex gap-3 items-start">
                        <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-gray-100 overflow-hidden ring-1 ring-gray-200/50">
                            <img src={market.image_url} alt="" className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-black leading-snug">
                                {market.question}
                            </h3>
                        </div>
                    </div>

                    {/* Outcomes - Yes/No Row */}
                    <div className="flex gap-2 items-center">
                        <div className="flex-1 flex items-center justify-between gap-2 px-3 py-2 bg-green-50 border border-green-200/50 rounded-lg">
                            <span className="text-xs font-medium text-green-700">Yes</span>
                            <span className="text-sm font-bold text-green-900">{market.yes_probability}%</span>
                        </div>
                        <button className="px-2 py-1.5 text-xs font-bold text-green-600 hover:bg-green-50 rounded transition-colors">
                            Yes
                        </button>
                        <div className="flex-1 flex items-center justify-between gap-2 px-3 py-2 bg-red-50 border border-red-200/50 rounded-lg">
                            <span className="text-xs font-medium text-red-700">No</span>
                            <span className="text-sm font-bold text-red-900">{noProbability}%</span>
                        </div>
                        <button className="px-2 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded transition-colors">
                            No
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <TrendingUp className="h-3.5 w-3.5" />
                            <span>{market.volume}</span>
                        </div>
                        <span>Monthly</span>
                        <button className="ml-auto p-1 hover:bg-muted rounded transition-colors">
                            <Bookmark className="h-4 w-4 text-muted-foreground hover:text-black" />
                        </button>
                    </div>
                </div>
            </Link>

            {/* Desktop Card View */}
            <Link
                href={`/markets/${market.id}`}
                className="hidden md:block overflow-hidden rounded-[20px] border-2 border-gray-300 bg-gradient-to-br from-white via-gray-50/30 to-gray-100/50 backdrop-blur-sm p-5 md:p-6 cursor-pointer transition-all duration-300 hover:border-gray-400 hover:bg-gradient-to-br hover:from-white hover:via-gray-50 hover:to-gray-100 hover:shadow-xl hover:shadow-black/8 active:scale-[0.98]"
            >
                <div className="flex items-start justify-between mb-5 md:mb-6">
                    <div className="h-12 w-12 md:h-14 md:w-14 shrink-0 overflow-hidden rounded-[12px] md:rounded-[14px] bg-gray-100 ring-1 ring-gray-200/50">
                        <img src={market.image_url} alt="" className="h-full w-full object-cover" />
                    </div>
                    {market.is_live && (
                        <div className="flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 md:px-3 py-1 md:py-1.5 ring-1 ring-red-200/50">
                            <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-[10px] md:text-[11px] font-semibold uppercase tracking-wider text-red-600">Live</span>
                        </div>
                    )}
                </div>

                <div className="grow mb-6">
                    <h3 className="text-base md:text-lg font-semibold leading-snug tracking-tight text-gray-900 hover:text-blue-600 transition-colors duration-200 mb-4">
                        {market.question}
                    </h3>

                    <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs md:text-sm font-medium text-gray-600">Yes Probability</span>
                            <span className="text-sm md:text-base font-semibold text-gray-900">{market.yes_probability}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden ring-1 ring-gray-200/50">
                            <div
                                className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-1000"
                                style={{ width: `${market.yes_probability}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4 md:gap-5">
                        <div className="flex items-center gap-1.5 text-xs md:text-sm font-medium text-gray-600">
                            <TrendingUp className="h-3.5 w-3.5 md:h-4 md:w-4 text-gray-400" />
                            <span>{market.volume}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs md:text-sm font-medium text-gray-600">
                            <span>{market.end_date}</span>
                        </div>
                    </div>
                </div>
            </Link>
        </>
    );
}
