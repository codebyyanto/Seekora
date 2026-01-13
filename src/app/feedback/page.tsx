"use client";

import { Navbar } from "@/components/ui/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw, Upload, AlertCircle, ThumbsUp, ArrowLeft } from "lucide-react";
import { useState, useRef } from "react";
import { simulateIrMethod } from "@/actions/simulate-ir";
import Link from "next/link";

type SearchResult = {
    id: number;
    content: string;
    score: number; // Similarity score
    isRelevant: boolean; // Feedback status
};

export default function FeedbackPage() {
    const [query, setQuery] = useState("");
    const [corpus, setCorpus] = useState("");
    const [results, setResults] = useState<SearchResult[] | null>(null);
    const [iteration, setIteration] = useState(0);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const filePromises = Array.from(files).map(file => {
            return new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const content = event.target?.result as string;
                    // Format as a distinct document for the backend
                    resolve(`--- Document: ${file.name} ---\n${content}`);
                };
                reader.readAsText(file);
            });
        });

        const contents = await Promise.all(filePromises);
        setCorpus(contents.join("\n\n"));
    };

    const runSearch = async (currentQuery: string) => {
        setError("");

        if (!currentQuery.trim()) {
            setError("Kueri kosong.");
            return;
        }
        if (!corpus.trim()) {
            setError("Dokumen kosong.");
            return;
        }

        try {
            // Call Server Action
            const output = await simulateIrMethod({
                methodId: "relevance",
                query: currentQuery,
                documents: corpus
            });

            if (output.error) {
                setError(output.error);
                return;
            }

            if (output.rankedDocuments) {
                const scoredDocs: SearchResult[] = output.rankedDocuments.map((doc) => {
                    const existingRel = results ? results.find(r => r.content === doc.content)?.isRelevant : false;
                    return {
                        id: doc.docId,
                        content: doc.content,
                        score: doc.score,
                        isRelevant: existingRel || false
                    };
                });
                setResults(scoredDocs);
            }

        } catch (e) {
            setError("Gagal menjalankan simulasi.");
        }
    };

    const handleInitialSearch = () => {
        setIteration(1);
        runSearch(query);
    };

    const toggleRelevance = (id: number) => {
        if (!results) return;
        setResults(results.map(r => r.id === id ? { ...r, isRelevant: !r.isRelevant } : r));
    };

    const applyFeedback = () => {
        if (!results) return;

        const relevantDocs = results.filter(r => r.isRelevant);
        if (relevantDocs.length === 0) {
            setError("Tandai setidaknya satu dokumen sebagai relevan.");
            return;
        }

        // Logic Rocchio Client-side (untuk sementara, karena backend hanya VSM)
        // Kita gunakan logika sederhana penambahan term dominan dari dokumen relevan
        const tokenize = (text: string) => text.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter(t => t.length > 3); // Basic tokenization match backend slightly

        const relevantTerms: string[] = [];
        relevantDocs.forEach(d => relevantTerms.push(...tokenize(d.content)));

        const counts: Record<string, number> = {};
        relevantTerms.forEach(t => counts[t] = (counts[t] || 0) + 1);

        const newTerms = Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(e => e[0]);

        // Avoid duplicates in query
        const currentTerms = new Set(query.toLowerCase().split(" "));
        const termsToAdd = newTerms.filter(t => !currentTerms.has(t));

        if (termsToAdd.length === 0) {
            setError("Tidak ada kata kunci baru yang signifikan ditemukan.");
            return;
        }

        const updatedQuery = `${query} ${termsToAdd.join(" ")}`;

        setQuery(updatedQuery);
        setIteration(prev => prev + 1);
        runSearch(updatedQuery);
    };

    const handleUnifiedSimulation = () => {
        // If results exist and at least one is relevant, run feedback logic
        if (results && results.some(r => r.isRelevant)) {
            applyFeedback();
        } else {
            // Otherwise, normal fresh search
            handleInitialSearch();
        }
    };

    return (
        <main className="min-h-screen flex flex-col font-sans selection:bg-seekora-primary/30">
            <Navbar />

            <div className="flex-1 px-6 pt-32 pb-20">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Back Button */}
                    <Link href="/methods">
                        <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-violet-400 mb-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali ke Metode
                        </Button>
                    </Link>

                    {/* Header */}
                    <div className="glass-card p-8 border-l-4 border-l-violet-500 space-y-2">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-violet-500/10 rounded-lg">
                                <RefreshCw className="w-6 h-6 text-violet-500" />
                            </div>
                            <h1 className="text-2xl font-bold">Umpan Balik Relevansi (Relevance Feedback)</h1>
                        </div>
                        <p className="text-slate-400 pl-14">
                            Proses berulang yang menyempurnakan hasil pencarian berdasarkan umpan balik pengguna. Setelah pencarian awal, Anda dapat menandai dokumen sebagai 'relevan' atau 'tidak relevan' untuk meningkatkan iterasi pencarian berikutnya.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Input */}
                        <div className="glass-card p-6 space-y-6">
                            <div className="space-y-2">
                                <h2 className="text-lg font-semibold">Input Simulasi</h2>
                                <p className="text-sm text-slate-400">Putaran: {iteration > 0 ? `Iterasi ke-${iteration}` : "Pencarian Awal"}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Kueri {iteration > 1 && "(Diperluas)"}</label>
                                <Input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="font-mono text-violet-400"
                                    placeholder="cth: model machine learning"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    {/* Label Dokumen with Reset button if needed, but let's keep clean */}
                                    <label className="text-sm font-medium text-slate-300">Dokumen</label>
                                    <Button variant="outline" size="sm" className="h-8 text-xs gap-2" onClick={() => fileInputRef.current?.click()}>
                                        <Upload className="w-3 h-3" />
                                        Unggah File
                                    </Button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        multiple
                                        accept=".txt,.md,.csv,.json"
                                        onChange={handleFileUpload}
                                    />
                                </div>
                                <Textarea
                                    placeholder="Sediakan satu set dokumen untuk pencarian awal dan putaran umpan balik."
                                    className="min-h-[200px] font-mono text-sm leading-relaxed"
                                    value={corpus}
                                    onChange={(e) => setCorpus(e.target.value)}
                                />
                            </div>

                            {error && (
                                <div className="flex items-center space-x-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <Button
                                className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                                size="lg"
                                onClick={handleUnifiedSimulation}
                            >
                                Jalankan Simulasi
                            </Button>
                        </div>

                        {/* Result */}
                        <div className="glass-card p-6 h-full min-h-[500px] flex flex-col">
                            <div className="space-y-1 mb-6">
                                <h2 className="text-lg font-semibold">Hasil</h2>
                                <p className="text-sm text-slate-400">Keluaran dari simulasi akan muncul di sini.</p>
                            </div>

                            <div className="flex-1 rounded-xl bg-white/5 border border-dashed border-white/10 p-4 overflow-y-auto max-h-[600px] custom-scrollbar">
                                {results ? (
                                    <div className="space-y-4">
                                        {results.map((res) => (
                                            <div
                                                key={res.id}
                                                className={`p-4 rounded-lg border transition-all ${res.isRelevant ? "bg-violet-500/10 border-violet-500" : "bg-black/40 border-white/5 hover:border-violet-500/30"}`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm font-semibold text-slate-300">Dokumen #{res.id}</span>
                                                        <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-slate-400">Score: {res.score.toFixed(2)}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => toggleRelevance(res.id)}
                                                        className={`p-1.5 rounded-full transition-colors ${res.isRelevant ? "bg-violet-500 text-white" : "bg-white/5 text-slate-500 hover:bg-white/20"}`}
                                                        title={res.isRelevant ? "Tandai tidak relevan" : "Tandai relevan"}
                                                    >
                                                        <ThumbsUp className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <p className="text-sm text-slate-400">"{res.content}"</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4 opacity-50">
                                        <p>Hasil akan ditampilkan di sini setelah menjalankan simulasi.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
