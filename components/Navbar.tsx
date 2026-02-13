"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Command, LogOut, Menu, X, Wallet, ArrowUpCircle, BarChart3, Settings } from "lucide-react";

const navigation = [
    { name: "Markets", href: "/" },
    { name: "Activity", href: "/activity" },
    { name: "Rewards", href: "/rewards" },
    { name: "How it Works", href: "/how-it-works" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [user, setUser] = useState<{ full_name: string; phone_number: string; balance?: string } | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
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
                const response = await fetch("http://127.0.0.1:8000/api/markets/dashboard/", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
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

    const handleLogout = () => {
        localStorage.removeItem("poly_user");
        setUser(null);
        setIsProfileOpen(false);
        window.location.href = "/";
    };

    // Close profile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!(e.target as HTMLElement).closest('.profile-menu')) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 apple-glass">
            <div className="mx-auto flex h-14 md:h-12 max-w-[1200px] items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-4 md:gap-8">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-1 text-black"
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>

                    <Link href="/" className="flex items-center gap-1.5 transition-opacity hover:opacity-80">
                        <div className="h-6 w-6 flex items-center justify-center rounded-md bg-black text-white shrink-0">
                            <Command className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-bold tracking-tight">
                            poly.co.ke
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-6">
                        {navigation.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`text-[12px] font-medium transition-colors hover:text-black ${pathname === item.href ? "text-black" : "text-muted-foreground"
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3 md:gap-5">
                    {/* Balance Display */}
                    {user && (
                        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-apple-green/10 to-apple-blue/10 border border-apple-green/20">
                            <Wallet className="h-4 w-4 text-apple-green" />
                            <span className="text-[11px] md:text-[12px] font-bold text-black">KSh <span className="text-apple-green font-black">{balance}</span></span>
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        {user ? (
                            <div className="flex items-center gap-2 md:gap-4">
                                <Link
                                    href="/dashboard"
                                    className="hidden sm:flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full bg-black text-white text-[11px] md:text-[12px] font-bold transition-opacity hover:opacity-90"
                                >
                                    <BarChart3 className="h-3.5 w-3.5" />
                                    Dashboard
                                </Link>
                                <Link
                                    href="/deposit"
                                    className="hidden sm:flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full bg-apple-green text-white text-[11px] md:text-[12px] font-bold transition-opacity hover:opacity-90"
                                >
                                    <Wallet className="h-3.5 w-3.5" />
                                    Deposit
                                </Link>
                                <div className="relative profile-menu">
                                    <button 
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-muted hover:bg-[#e8e8ed] transition-colors"
                                    >
                                        <div className="h-5 w-5 rounded-full bg-black flex items-center justify-center text-[10px] text-white font-bold">
                                            {user.full_name.charAt(0)}
                                        </div>
                                        <span className="hidden xs:block text-[11px] md:text-[12px] font-bold text-black">{user.full_name.split(' ')[0]}</span>
                                    </button>
                                    {isProfileOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-48 flex-col gap-1 bg-white border border-border rounded-lg shadow-lg z-50 p-2 flex">
                                            <Link
                                                href="/dashboard"
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center gap-2 px-3 py-2 rounded-md text-black font-bold text-sm hover:bg-muted transition-all"
                                            >
                                                <BarChart3 className="h-4 w-4" />
                                                Dashboard
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
                            <div className="flex items-center gap-1 md:gap-2">
                                <Link
                                    href="/login"
                                    className="px-3 md:px-4 py-1.5 text-[11px] md:text-[12px] font-bold text-black bg-muted rounded-full transition-colors hover:bg-[#e8e8ed]"
                                >
                                    Log In
                                </Link>
                                <Link
                                    href="/signup"
                                    className="rounded-full bg-black px-3 md:px-4 py-1.5 text-[11px] md:text-[12px] font-bold text-white transition-opacity hover:opacity-90"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="md:hidden fixed inset-0 top-14 bg-white z-40 p-6 flex flex-col gap-8 animate-in slide-in-from-left duration-300">
                    <div className="flex flex-col gap-6">
                        {navigation.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMenuOpen(false)}
                                className={`text-2xl font-bold tracking-tight ${pathname === item.href ? "text-black" : "text-muted-foreground"
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <div className="mt-auto border-t pt-8 pb-10">
                        <div className="flex flex-col gap-4">
                            {!user ? (
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <Link
                                        href="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center justify-center h-14 rounded-2xl bg-muted text-lg font-bold text-black"
                                    >
                                        Log In
                                    </Link>
                                    <Link
                                        href="/signup"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center justify-center h-14 rounded-2xl bg-black text-lg font-bold text-white"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4 mb-6">
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-b from-apple-green/10 to-apple-blue/10 border border-apple-green/20">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-black flex items-center justify-center text-sm text-white font-bold">
                                                {user.full_name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-black">{user.full_name}</p>
                                                <p className="text-sm text-apple-green font-semibold">KSh {balance}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsMenuOpen(false);
                                            }}
                                            className="p-2 text-apple-red"
                                        >
                                            <LogOut className="h-6 w-6" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center justify-center gap-2 h-14 rounded-2xl bg-black text-white font-bold"
                                        >
                                            <BarChart3 className="h-5 w-5" />
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/deposit"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center justify-center gap-2 h-14 rounded-2xl bg-apple-green text-white font-bold"
                                        >
                                            <Wallet className="h-5 w-5" />
                                            Deposit
                                        </Link>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link
                                            href="/withdraw"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center justify-center gap-2 h-14 rounded-2xl bg-muted border border-border text-black font-bold"
                                        >
                                            <ArrowUpCircle className="h-5 w-5" />
                                            Withdraw
                                        </Link>
                                        <Link
                                            href="/admin"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center justify-center gap-2 h-14 rounded-2xl bg-muted border border-border text-black font-bold"
                                        >
                                            <Settings className="h-5 w-5" />
                                            Admin
                                        </Link>
                                    </div>
                                </div>
                            )}

                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search markets"
                                    className="h-14 w-full rounded-2xl bg-muted pl-12 pr-4 text-lg placeholder:text-muted-foreground focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
