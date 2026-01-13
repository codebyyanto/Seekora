"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Search, Hexagon, X } from "lucide-react";
import { useState, useEffect, Suspense } from "react";

function NavbarContent() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState("");

    // Sync Input with URL param
    useEffect(() => {
        const q = searchParams.get("q");
        if (q) setSearchQuery(q);
    }, [searchParams]);

    const handleSearch = (term: string) => {
        setSearchQuery(term);

        // Defer the URL update slightly or do it immediately
        const params = new URLSearchParams(searchParams.toString());
        if (term) {
            params.set("q", term);
        } else {
            params.delete("q");
        }

        // If not on methods page, redirect there. If on methods, replace logic handles filter.
        if (pathname !== "/methods") {
            router.push(`/methods?${params.toString()}`);
        } else {
            router.replace(`/methods?${params.toString()}`);
        }
    };

    const links = [
        { name: "Beranda", href: "/" },
        { name: "Metode", href: "/methods" },
        { name: "Tentang", href: "/about" },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-center px-6">
            <div className="w-full max-w-7xl glass rounded-full px-6 py-3 flex items-center justify-between shadow-2xl shadow-seekora-primary/10 mt-4">
                {/* Left Side: Logo */}
                <div className="flex items-center">
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-seekora-primary to-seekora-accent rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300">
                            <Hexagon className="text-white w-6 h-6 animate-pulse" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 hidden sm:block">
                            Seekora
                        </span>
                    </Link>
                </div>

                {/* Right Side: Links & Search */}
                <div className="flex items-center space-x-8">
                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center space-x-6">
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-seekora-primary relative group",
                                    pathname === link.href ? "text-seekora-primary" : "text-slate-400"
                                )}
                            >
                                {link.name}
                                <span className={cn(
                                    "absolute -bottom-1 left-0 w-full h-[2px] bg-seekora-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left",
                                    pathname === link.href && "scale-x-100"
                                )} />
                            </Link>
                        ))}
                    </div>

                    {/* Search Box */}
                    <div className="relative group hidden sm:block">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-500 group-focus-within:text-seekora-primary transition-colors" />
                        </div>
                        <input
                            type="text"
                            className="block w-48 sm:w-64 pl-10 pr-8 py-2 text-sm border border-white/10 rounded-full leading-5 bg-black/20 text-slate-300 placeholder-slate-500 focus:outline-none focus:bg-seekora-card/80 focus:border-seekora-primary/50 focus:ring-1 focus:ring-seekora-primary/50 transition-all shadow-inner"
                            placeholder="Cari metode..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => handleSearch("")}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                <X className="h-3 w-3 text-slate-500 hover:text-white transition-colors" />
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button (Stub) */}
                    <div className="md:hidden">
                        {/* Mobile menu implementation */}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export function Navbar() {
    return (
        <Suspense fallback={<nav className="fixed top-0 left-0 right-0 z-50 h-20" />}>
            <NavbarContent />
        </Suspense>
    );
}
