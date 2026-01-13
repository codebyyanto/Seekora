"use client";

import { Navbar } from "@/components/ui/Navbar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
    Search,
    GitMerge,
    Database,
    ThumbsUp,
    ScatterChart,
    Hexagon,
} from "lucide-react";

function MethodsList() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";

    const features = [
        { title: "Regex Search", desc: "Pencarian Berbasis Pola Teks", icon: Search, color: "text-blue-400", href: "/regex" },
        { title: "Boolean Retrieval", desc: "Logika AND, OR, NOT", icon: GitMerge, color: "text-purple-400", href: "/boolean" },
        { title: "Vector Space Model", desc: "Perankingan Cosine Similarity", icon: Database, color: "text-indigo-400", href: "/vector" },
        { title: "BM25 Ranking", desc: "Probabilistic Information Retrieval", icon: ScatterChart, color: "text-cyan-400", href: "/bm25" },
        { title: "Relevance Feedback", desc: "Penyempurnaan Hasil Pencarian", icon: ThumbsUp, color: "text-pink-400", href: "/feedback" },
        { title: "Clustering", desc: "Pengelompokan Dokumen (K-Means)", icon: Hexagon, color: "text-emerald-400", href: "/clustering" },
    ];

    const filteredFeatures = features.filter(f =>
        f.title.toLowerCase().includes(query.toLowerCase()) ||
        f.desc.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <section className="px-6 py-32 relative z-10">
            <div className="max-w-7xl mx-auto space-y-12">
                <div className="text-center space-y-6">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-seekora-primary via-seekora-accent to-pink-500">
                        Metode & Fitur Seekora
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Eksplorasi berbagai metode Information Retrieval mulai dari pencarian dasar hingga algoritma perankingan modern.
                    </p>
                    <div className="h-1 w-20 bg-gradient-to-r from-transparent via-seekora-primary to-transparent mx-auto mt-4" />
                </div>

                {filteredFeatures.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-[fade-in_0.5s_ease-out]">
                        {filteredFeatures.map((feature, idx) => (
                            <Link href={feature.href} key={feature.title} className="group">
                                <div className="glass-card p-6 h-full flex flex-col justify-between border border-white/5 hover:border-seekora-primary/50 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-b from-seekora-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="space-y-4 relative z-10">
                                        <h3 className="text-xl font-bold group-hover:text-seekora-primary transition-colors">{feature.title}</h3>
                                        <p className="text-sm text-slate-400">{feature.desc}</p>
                                    </div>

                                    <div className="mt-8 flex items-end justify-between">
                                        <feature.icon className={cn("w-10 h-10 opacity-50 group-hover:opacity-100 transition-all", feature.color)} />
                                        <div className="text-xs text-slate-600 group-hover:text-white transition-colors">Cobalah &rarr;</div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-slate-500">
                        <p>Tidak ditemukan metode yang cocok dengan "{query}".</p>
                    </div>
                )}
            </div>
        </section>
    );
}

export default function MethodsPage() {
    return (
        <main className="min-h-screen flex flex-col font-sans selection:bg-seekora-primary/30">
            <Navbar />
            <Suspense fallback={<div className="text-center py-20">Loading methods...</div>}>
                <MethodsList />
            </Suspense>
        </main>
    );
}
