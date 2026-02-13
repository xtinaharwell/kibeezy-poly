"use client";

import { TrendingUp, Clock, ChevronRight } from "lucide-react";
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
    return (
        <Link
            href={`/markets/${market.id}`}
            className="apple-card group flex flex-col p-4 md:p-6 cursor-pointer active:scale-[0.98] transition-all"
        >
            <div className="flex items-start justify-between mb-4 md:mb-6">
                <div className="h-10 w-10 md:h-12 md:w-12 shrink-0 overflow-hidden rounded-xl md:rounded-2xl bg-muted p-0.5">
                    <img src={market.image_url} alt="" className="h-full w-full object-cover rounded-[10px] md:rounded-[14px]" />
                </div>
                {market.is_live && (
                    <div className="flex items-center gap-1.5 rounded-full bg-apple-red/10 px-2 md:px-2.5 py-0.5 md:py-1">
                        <div className="h-1 w-1 md:h-1.5 md:w-1.5 rounded-full bg-apple-red animate-pulse" />
                        <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-apple-red">Live</span>
                    </div>
                )}
            </div>

            <div className="grow">
                <h3 className="text-md md:text-lg font-semibold leading-tight tracking-tight text-gray-900 group-hover:text-apple-blue transition-colors mb-4">
                    {market.question}
                </h3>

                <div className="space-y-3">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between text-[11px] md:text-sm">
                            <span className="font-medium text-muted-foreground">Yes Probability</span>
                            <span className="font-bold">{market.yes_probability}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-apple-green rounded-full transition-all duration-1000"
                                style={{ width: `${market.yes_probability}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 md:mt-8 flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-4 text-[10px] md:text-xs font-semibold text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 md:h-3.5 w-3 md:w-3.5 opacity-50" />
                        <span>{market.volume}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 md:h-3.5 w-3 md:w-3.5 opacity-50" />
                        <span>{market.end_date}</span>
                    </div>
                </div>
                <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                    <ChevronRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
                </div>
            </div>
        </Link>
    );
}
