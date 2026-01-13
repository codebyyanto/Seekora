"use client";

import { Navbar } from "@/components/ui/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GitMerge, Upload, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { useState, useRef } from "react";
import { simulateIrMethod } from "@/actions/simulate-ir";
import Link from "next/link";

export default function BooleanPage() {
    const [query, setQuery] = useState("");
    const [corpus, setCorpus] = useState("");
    const [results, setResults] = useState<{ id: number; content: string }[] | null>(null);
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

    const handleSimulate = async () => {
        setError("");
        setResults(null);

        if (!query.trim()) {
            setError("Masukkan kueri boolean (AND, OR, NOT).");
            return;
        }
        if (!corpus.trim()) {
            setError("Masukkan dokumen untuk dicari.");
            return;
        }

        try {
            const output = await simulateIrMethod({
                methodId: "boolean",
                query: query,
                documents: corpus
            });

            if (output.error) {
                setError(output.error);
                return;
            }

            if (output.matchedDocuments) {
                const matches = output.matchedDocuments.map(doc => ({
                    id: doc.docId,
                    content: doc.content
                }));
                setResults(matches);
            }

        } catch (err) {
            setError("Gagal menjalankan simulasi.");
        }
    };

    return (
        <main className="min-h-screen flex flex-col font-sans selection:bg-seekora-primary/30">
            <Navbar />

            <div className="flex-1 px-6 pt-32 pb-20">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Back Button */}
                    <Link href="/methods">
                        <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-purple-400 mb-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali ke Metode
                        </Button>
                    </Link>

                    {/* Header */}
                    <div className="glass-card p-8 border-l-4 border-l-purple-500 space-y-2">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <GitMerge className="w-6 h-6 text-purple-500" />
                            </div>
                            <h1 className="text-2xl font-bold">Retrieval Boolean</h1>
                        </div>
                        <p className="text-slate-400 pl-14">
                            Mengambil dokumen berdasarkan logika boolean yang ketat. Gunakan operator seperti AND, OR, dan NOT untuk menggabungkan kata kunci.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Input */}
                        <div className="glass-card p-6 space-y-6">
                            <div className="space-y-2">
                                <h2 className="text-lg font-semibold">Input Simulasi</h2>
                                <p className="text-sm text-slate-400">Berikan kueri boolean dan dokumen.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Kueri</label>
                                <Input
                                    placeholder="cth: react AND (nextjs OR gatsby) NOT angular"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="font-mono text-purple-400"
                                />
                            </div>

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
                                    placeholder="Tempel korpus dokumen Anda di sini (pisahkan baris)..."
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
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                                size="lg"
                                onClick={handleSimulate}
                            >
                                Jalankan Simulasi
                            </Button>
                        </div>

                        {/* Result */}
                        <div className="glass-card p-6 h-full min-h-[500px] flex flex-col">
                            <div className="space-y-1 mb-6">
                                <h2 className="text-lg font-semibold">Hasil</h2>
                                <p className="text-sm text-slate-400">Dokumen yang memenuhi logika boolean.</p>
                            </div>

                            <div className="flex-1 rounded-xl bg-white/5 border border-dashed border-white/10 p-4 overflow-y-auto max-h-[600px] custom-scrollbar">
                                {results ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-2 text-green-400 bg-green-400/10 p-3 rounded-lg border border-green-400/20 mb-4">
                                            <CheckCircle2 className="w-5 h-5" />
                                            <span>Ditemukan {results.length} dokumen.</span>
                                        </div>
                                        {results.map((res) => (
                                            <div key={res.id} className="p-4 rounded-lg bg-black/40 border border-purple-500/30 hover:border-purple-500 transition-colors">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold">
                                                        {res.id}
                                                    </span>
                                                    <span className="text-sm font-semibold text-slate-300">Dokumen #{res.id}</span>
                                                </div>
                                                <p className="text-sm text-slate-400">"{res.content}"</p>
                                            </div>
                                        ))}
                                        {results.length === 0 && (
                                            <div className="text-center text-slate-500 py-10">
                                                Tidak ada dokumen yang cocok dengan logika tersebut.
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4 opacity-50">
                                        <GitMerge className="w-12 h-12" />
                                        <p>Hasil akan ditampilkan di sini.</p>
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
