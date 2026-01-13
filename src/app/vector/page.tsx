"use client";

import { Navbar } from "@/components/ui/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Database, Upload, AlertCircle, BarChart3, ArrowLeft } from "lucide-react";
import { useState, useRef } from "react";
import { simulateIrMethod } from "@/actions/simulate-ir";
import Link from "next/link";

type SearchResult = {
    docId: number;
    content: string;
    score: number;
    details: { term: string; tf: number; idf: number; tfidf: number }[];
};

export default function VectorPage() {
    const [query, setQuery] = useState("");
    const [corpus, setCorpus] = useState("");
    const [results, setResults] = useState<SearchResult[] | null>(null);
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

    const calculateVSM = async () => {
        setError("");
        setResults(null);

        if (!query.trim()) {
            setError("Masukkan kueri terlebih dahulu.");
            return;
        }
        if (!corpus.trim()) {
            setError("Masukkan setidaknya satu dokumen.");
            return;
        }

        try {
            const output = await simulateIrMethod({
                methodId: "vsm",
                query: query,
                documents: corpus
            });

            if (output.error) {
                setError(output.error);
                return;
            }

            if (output.rankedDocuments) {
                const rankedResults: SearchResult[] = output.rankedDocuments.map(doc => ({
                    docId: doc.docId,
                    content: doc.content,
                    score: doc.score,
                    details: [] // Backend doesn't return details
                }));
                setResults(rankedResults);
            }

        } catch (err) {
            setError("Terjadi kesalahan dalam perhitungan.");
        }
    };

    return (
        <main className="min-h-screen flex flex-col font-sans selection:bg-seekora-primary/30">
            <Navbar />

            <div className="flex-1 px-6 pt-32 pb-20">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Back Button */}
                    <Link href="/methods">
                        <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-seekora-primary mb-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali ke Metode
                        </Button>
                    </Link>

                    {/* Header */}
                    <div className="glass-card p-8 border-l-4 border-l-seekora-primary space-y-2">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-seekora-primary/10 rounded-lg">
                                <Database className="w-6 h-6 text-seekora-primary" />
                            </div>
                            <h1 className="text-2xl font-bold">Vector Space Model</h1>
                        </div>
                        <p className="text-slate-400 pl-14">
                            Merepresentasikan dokumen dan kueri sebagai vektor dalam ruang multi-dimensi. Ini memberi peringkat dokumen berdasarkan kesamaan kosinus antara vektor kueri dan vektor dokumen.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Left Column: Input */}
                        <div className="space-y-6">
                            <div className="glass-card p-6 space-y-6">
                                <div className="space-y-2">
                                    <h2 className="text-lg font-semibold">Input Simulasi</h2>
                                    <p className="text-sm text-slate-400">Berikan kueri dan dokumen Anda untuk menjalankan simulasi.</p>
                                </div>

                                {/* Query Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Kueri</label>
                                    <Input
                                        placeholder="cth: keamanan aplikasi web"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        className="font-mono text-seekora-primary"
                                    />
                                </div>

                                {/* Document Input */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
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
                                        placeholder="Tempel beberapa dokumen di sini (setiap baris dianggap satu dokumen)..."
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
                                    className="w-full bg-seekora-primary hover:bg-seekora-primary/90 text-white"
                                    size="lg"
                                    onClick={calculateVSM}
                                >
                                    Jalankan Simulasi
                                </Button>
                            </div>
                        </div>

                        {/* Right Column: Result */}
                        <div className="h-full">
                            <div className="glass-card p-6 h-full min-h-[500px] flex flex-col">
                                <div className="space-y-1 mb-6">
                                    <h2 className="text-lg font-semibold">Hasil Perankingan</h2>
                                    <p className="text-sm text-slate-400">Dokumen diurutkan berdasarkan skor relevansi (0.0 - 1.0).</p>
                                </div>

                                <div className="flex-1 rounded-xl bg-white/5 border border-dashed border-white/10 p-4 overflow-y-auto max-h-[600px] custom-scrollbar">
                                    {results ? (
                                        <div className="space-y-4">
                                            {results.map((res, idx) => (
                                                <div key={res.docId} className="p-4 rounded-lg bg-black/40 border border-white/5 hover:border-seekora-primary/50 transition-colors">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex items-center space-x-2">
                                                            <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${idx === 0 ? "bg-yellow-500 text-black" : "bg-white/10 text-white"}`}>
                                                                {idx + 1}
                                                            </span>
                                                            <span className="text-sm font-semibold text-slate-300">Dokumen #{res.docId}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1 bg-seekora-primary/20 px-2 py-0.5 rounded text-xs text-seekora-primary font-mono">
                                                            <BarChart3 className="w-3 h-3" />
                                                            <span>{res.score.toFixed(4)}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-slate-400 mb-3 line-clamp-2 italic">"{res.content}"</p>

                                                    {/* Term Details */}
                                                    {res.details.length > 0 && (
                                                        <div className="flex flex-wrap gap-2">
                                                            {res.details.map((d, i) => (
                                                                <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-500 border border-white/5">
                                                                    {d.term}: {d.tfidf.toFixed(2)}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4 opacity-50">
                                            <Database className="w-12 h-12" />
                                            <p>Hasil perankingan akan muncul di sini.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
