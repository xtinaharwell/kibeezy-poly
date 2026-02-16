"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { Search, Command, LogOut, Wallet, Home, BarChart3, Settings, ChevronDown, DollarSign, User, TrendingUp, Bell, Gift, HelpCircle } from "lucide-react";
import DepositModal from "./DepositModal";

export default function Navbar() {
    const pathname = usePathname();
    const [user, setUser] = useState<{ full_name: string; phone_number: string; balance?: string } | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [balance, setBalance] = useState<string>("0.00");

    useEffect(() => {
        const checkUser = () => {
            const storedUser = localStorage.getItem("poly_user");
            if (storedUser) {
                try {
                    const parsed = JSON.parse(storedUser);
                    setUser(parsed);
                    // Fetch latest balance from API
                    fetchBalance();
                } catch (e) {
                    localStorage.removeItem("poly_user");
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };

        const fetchBalance = async () => {
            try {
                const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/markets/dashboard/`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (response.ok) {
                    const data = await response.json();
                    setBalance(parseFloat(data.user.balance).toFixed(2));
                }
            } catch (err) {
                console.error("Failed to fetch balance", err);
            }
        };

        checkUser();
        window.addEventListener("poly_auth_change", checkUser);
        return () => window.removeEventListener("poly_auth_change", checkUser);
    }, []);

    // Close profile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!(e.target as HTMLElement).closest('.profile-menu') && !(e.target as HTMLElement).closest('.mobile-profile-menu') && !(e.target as HTMLElement).closest('.notification-menu')) {
                setIsProfileOpen(false);
                setIsMobileProfileOpen(false);
                setIsNotificationOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("poly_user");
        setUser(null);
        setIsProfileOpen(false);
        window.location.href = "/";
    };

    return (
        <>
        <nav className="fixed top-0 left-0 right-0 z-50 apple-glass backdrop-blur-xl">
            <div className="mx-auto flex h-16 sm:h-14 md:h-12 max-w-[1200px] items-center justify-between px-3 sm:px-4 md:px-6">
                {/* Left Section: Logo + Nav */}
                <div className="flex items-center gap-3 sm:gap-4 md:gap-8 flex-shrink-0">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-1.5 transition-opacity hover:opacity-80 flex-shrink-0">
                        <div className="h-6 w-6 sm:h-7 sm:w-7 flex items-center justify-center rounded-md bg-black text-white shrink-0">
                            <Command className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </div>
                        <span className="hidden md:inline text-sm font-bold tracking-tight text-black">
                            KASOKO
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                </div>

                {/* Right Section: Balance + Auth */}
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                    {/* Balance Display - Mobile Compact */}
                    {user && (
                        <div className="hidden xs:flex items-center gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 rounded-lg bg-gradient-to-r from-apple-green/10 to-apple-blue/10 border border-apple-green/20">
                            <Wallet className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-apple-green flex-shrink-0" />
                            <span className="text-[10px] sm:text-xs md:text-xs font-bold text-black whitespace-nowrap">
                                KSh <span className="text-apple-green font-black">{balance}</span>
                            </span>
                        </div>
                    )}

                    {/* Auth Section */}
                    {user ? (
                        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                            {/* Desktop Buttons */}
                            <Link
                                href="/dashboard"
                                className="hidden sm:flex items-center gap-1 px-2 md:px-3 py-1 rounded-lg bg-black text-white text-xs font-semibold transition-all hover:opacity-80 active:scale-95"
                            >
                                <BarChart3 className="h-4 w-4" />
                                <span className="hidden md:inline text-xs">Dashboard</span>
                            </Link>
                            <button
                                onClick={() => setIsDepositModalOpen(true)}
                                className="hidden sm:flex items-center gap-1 px-2 md:px-3 py-1 rounded-lg bg-apple-green text-white text-xs font-semibold transition-all hover:opacity-80 active:scale-95"
                            >
                                <Wallet className="h-4 w-4" />
                                <span className="hidden md:inline text-xs">Deposit</span>
                            </button>

                            {/* Notification Icon - Mobile */}
                            <button
                                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                className="relative sm:hidden p-2 hover:bg-muted rounded-lg transition-colors"
                                aria-label="Notifications"
                            >
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                            </button>

                            {/* Mobile Profile Menu - Top Right */}
                            <div className="relative mobile-profile-menu sm:hidden">
                                <button
                                    onClick={() => setIsMobileProfileOpen(!isMobileProfileOpen)}
                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                    aria-label="User menu"
                                >
                                    <div className="h-6 w-6 rounded-full bg-black flex items-center justify-center text-xs text-white font-bold">
                                        {user.full_name.charAt(0)}
                                    </div>
                                </button>
                                {isMobileProfileOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-border rounded-lg shadow-lg z-50 p-2 flex flex-col gap-1 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setIsMobileProfileOpen(false)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-md text-black font-bold text-sm hover:bg-muted transition-all"
                                        >
                                            <BarChart3 className="h-4 w-4" />
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/activity"
                                            onClick={() => setIsMobileProfileOpen(false)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-md text-black font-bold text-sm hover:bg-muted transition-all"
                                        >
                                            <BarChart3 className="h-4 w-4" />
                                            Activity
                                        </Link>
                                        <Link
                                            href="/rewards"
                                            onClick={() => setIsMobileProfileOpen(false)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-md text-black font-bold text-sm hover:bg-muted transition-all"
                                        >
                                            <Gift className="h-4 w-4" />
                                            Rewards
                                        </Link>
                                        <Link
                                            href="/how-it-works"
                                            onClick={() => setIsMobileProfileOpen(false)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-md text-black font-bold text-sm hover:bg-muted transition-all"
                                        >
                                            <HelpCircle className="h-4 w-4" />
                                            How it Works
                                        </Link>
                                        <Link
                                            href="/admin"
                                            onClick={() => setIsMobileProfileOpen(false)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-md text-black font-bold text-sm hover:bg-muted transition-all"
                                        >
                                            <Settings className="h-4 w-4" />
                                            Admin Panel
                                        </Link>
                                        <div className="border-t border-border my-1"></div>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsMobileProfileOpen(false);
                                            }}
                                            className="flex items-center gap-2 px-3 py-2 rounded-md text-apple-red font-bold text-sm hover:bg-apple-red/5 transition-all"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Notification Menu - Mobile */}
                            {isNotificationOpen && (
                                <div className="absolute right-12 top-16 w-72 bg-white border border-border rounded-lg shadow-lg z-50 p-4 sm:hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-bold text-sm">Notifications</h3>
                                        <button
                                            onClick={() => setIsNotificationOpen(false)}
                                            className="text-muted-foreground hover:text-black"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <div className="space-y-3 max-h-64 overflow-y-auto">
                                        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                                            <p className="text-xs font-semibold text-blue-900">Welcome to KASOKO!</p>
                                            <p className="text-xs text-blue-700 mt-1">Start predicting markets to earn rewards</p>
                                        </div>
                                        <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                                            <p className="text-xs font-semibold text-green-900">Account Verified</p>
                                            <p className="text-xs text-green-700 mt-1">Your account has been verified</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Profile Menu - Desktop */}
                            <div className="relative profile-menu hidden sm:block">
                                <button 
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-1 px-2 md:px-3 py-1.5 rounded-full bg-muted hover:bg-[#e8e8ed] transition-colors touch-target"
                                    aria-label="User menu"
                                >
                                    <div className="h-5 w-5 md:h-6 md:w-6 rounded-full bg-black flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
                                        {user.full_name.charAt(0)}
                                    </div>
                                    <span className="hidden sm:block text-xs md:text-xs font-bold text-black truncate max-w-20">
                                        {user.full_name.split(' ')[0]}
                                    </span>
                                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                                </button>
                                {isProfileOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-border rounded-lg shadow-lg z-50 p-2 flex flex-col gap-1 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-md text-black font-bold text-sm hover:bg-muted transition-all"
                                        >
                                            <BarChart3 className="h-4 w-4" />
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/activity"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-md text-black font-bold text-sm hover:bg-muted transition-all"
                                        >
                                            <BarChart3 className="h-4 w-4" />
                                            Activity
                                        </Link>
                                        <Link
                                            href="/rewards"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-md text-black font-bold text-sm hover:bg-muted transition-all"
                                        >
                                            <Gift className="h-4 w-4" />
                                            Rewards
                                        </Link>
                                        <Link
                                            href="/how-it-works"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-md text-black font-bold text-sm hover:bg-muted transition-all"
                                        >
                                            <HelpCircle className="h-4 w-4" />
                                            How it Works
                                        </Link>
                                        <Link
                                            href="/admin"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-md text-black font-bold text-sm hover:bg-muted transition-all"
                                        >
                                            <Settings className="h-4 w-4" />
                                            Admin Panel
                                        </Link>
                                        <div className="border-t border-border my-1"></div>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsProfileOpen(false);
                                            }}
                                            className="flex items-center gap-2 px-3 py-2 rounded-md text-apple-red font-bold text-sm hover:bg-apple-red/5 transition-all"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <Link
                                href="/login"
                                className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-black bg-muted rounded-lg transition-all hover:bg-[#e8e8ed] active:scale-95"
                            >
                                Log In
                            </Link>
                            <Link
                                href="/signup"
                                className="rounded-lg bg-black px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>

        {/* Mobile Bottom Navigation */}
        {user && (
            <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden apple-glass backdrop-blur-xl border-t border-border">
                <div className="flex items-center justify-around h-20 px-2">
                    {/* Home */}
                    <Link
                        href="/"
                        className={`flex flex-col items-center justify-center gap-1 w-14 h-16 rounded-lg transition-colors ${pathname === "/" ? "text-black" : "text-muted-foreground"}`}
                    >
                        <Home className={`h-6 w-6 ${pathname === "/" ? "font-bold" : ""}`} />
                        <span className="text-[10px] font-semibold">Home</span>
                    </Link>

                    {/* Trending */}
                    <Link
                        href="/"
                        className="flex flex-col items-center justify-center gap-1 w-14 h-16 rounded-lg text-muted-foreground hover:text-black transition-colors"
                    >
                        <TrendingUp className="h-6 w-6" />
                        <span className="text-[10px] font-semibold">Trending</span>
                    </Link>

                    {/* Deposit */}
                    <button
                        onClick={() => setIsDepositModalOpen(true)}
                        className="flex flex-col items-center justify-center gap-1 w-14 h-16 rounded-lg text-muted-foreground hover:text-apple-green transition-colors"
                    >
                        <DollarSign className="h-6 w-6" />
                        <span className="text-[10px] font-semibold">Deposit</span>
                    </button>

                    {/* Portfolio */}
                    <Link
                        href="/dashboard"
                        className={`flex flex-col items-center justify-center gap-1 w-14 h-16 rounded-lg transition-colors ${pathname === "/dashboard" ? "text-black" : "text-muted-foreground"}`}
                    >
                        <BarChart3 className={`h-6 w-6 ${pathname === "/dashboard" ? "font-bold" : ""}`} />
                        <span className="text-[10px] font-semibold">Portfolio</span>
                    </Link>
                </div>
            </div>
        )}

        {/* Deposit Modal */}
        <DepositModal
            isOpen={isDepositModalOpen}
            onClose={() => setIsDepositModalOpen(false)}
            balance={balance}
        />
        </>
    );
}