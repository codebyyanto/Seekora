"use client";

import { Navbar } from "@/components/ui/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, Upload, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { useState, useRef } from "react";
import { simulateIrMethod } from "@/actions/simulate-ir";
import Link from "next/link";

export default function RegexPage() {
    const [pattern, setPattern] = useState("");
    const [text, setText] = useState("");
    const [result, setResult] = useState<React.ReactNode | null>(null);
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
        setText(contents.join("\n\n"));
    };

    const handleSimulate = async () => {
        setError("");
        setResult(null);

        if (!pattern.trim()) {
            setError("Masukkan pola regex terlebih dahulu.");
            return;
        }
        if (!text.trim()) {
            setError("Masukkan teks dokumen untuk dicari.");
            return;
        }

        try {
            const output = await simulateIrMethod({
                methodId: "regex",
                query: pattern,
                documents: text
            });

            if (output.error) {
                setError(output.error);
                return;
            }

            if (output.message) {
                setResult(<div className="text-slate-400">{output.message}</div>);
                return;
            }

            if (output.matches) {
                const elements = [];
                // Backend returns matches per document. Since input text is treated as "documents" (and split likely in backend),
                // but regex page UI treats 'text' as massive textarea. 
                // The backend strips newlines to make docs? 
                // Let's check backend logic: `ambilMetadataDokumen` splits by `\n\n` or header. 
                // If user pastes plain text with newlines, it might be split into multiple docs.
                // The frontend currently treats it as one big text for highlighting?
                // Original frontend: `text.match(regex)`.
                // Backend: `jalankanPencarianRegex` maps over documents.

                // To allow consistent visualization, we might just show the "matched content" from backend.
                // But backend `matches` has `content` and `highlights` indices relative to that content.

                const renderedMatches = output.matches.map((m, idx) => (
                    <div key={idx} className="mb-4 pb-4 border-b border-white/10 last:border-0">
                        <div className="text-xs font-bold text-slate-500 mb-2">{m.name}</div>
                        <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
                            {(() => {
                                const els = [];
                                let lastIdx = 0;
                                m.highlights.forEach(([start, end], hIdx) => {
                                    // Text before match
                                    els.push(m.content.slice(lastIdx, start));
                                    // Match
                                    els.push(
                                        <span key={hIdx} className="bg-seekora-primary/20 text-seekora-primary border-b-2 border-seekora-primary font-mono pb-0.5 rounded-t px-1">
                                            {m.content.slice(start, end)}
                                        </span>
                                    );
                                    lastIdx = end;
                                });
                                els.push(m.content.slice(lastIdx));
                                return els;
                            })()}
                        </div>
                    </div>
                ));

                setResult(
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2 text-green-400 bg-green-400/10 p-3 rounded-lg border border-green-400/20">
                            <CheckCircle2 className="w-5 h-5" />
                            <span>Ditemukan kecocokan di {output.matches.length} bagian/dokumen.</span>
                        </div>
                        <div className="p-4 rounded-xl bg-black/30 border border-white/10">
                            {renderedMatches}
                        </div>
                    </div>
                );
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
                        <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-seekora-primary mb-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali ke Metode
                        </Button>
                    </Link>

                    {/* Header */}
                    <div className="glass-card p-8 border-l-4 border-l-seekora-primary space-y-2">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-seekora-primary/10 rounded-lg">
                                <Search className="w-6 h-6 text-seekora-primary" />
                            </div>
                            <h1 className="text-2xl font-bold">Pencarian Regex</h1>
                        </div>
                        <p className="text-slate-400 pl-14">
                            Melakukan pencarian menggunakan ekspresi reguler untuk menemukan pola spesifik dalam kumpulan dokumen.
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
                                        placeholder="cth: info\w+"
                                        value={pattern}
                                        onChange={(e) => setPattern(e.target.value)}
                                        className="font-mono text-seekora-primary"
                                    />
                                </div>

                                {/* Document Input */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-medium text-slate-300">Dokumen</label>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            multiple
                                            accept=".txt,.md,.csv,.json"
                                            onChange={handleFileUpload}
                                        />
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 text-xs gap-2"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <Upload className="w-3 h-3" />
                                            Unggah File
                                        </Button>
                                    </div>
                                    <Textarea
                                        placeholder="Tempel satu atau lebih dokumen di sini..."
                                        className="min-h-[200px] font-mono text-sm"
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
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
                                    onClick={handleSimulate}
                                >
                                    Jalankan Simulasi
                                </Button>
                            </div>
                        </div>

                        {/* Right Column: Result */}
                        <div className="h-full">
                            <div className="glass-card p-6 h-full min-h-[500px] flex flex-col">
                                <div className="space-y-1 mb-6">
                                    <h2 className="text-lg font-semibold">Hasil</h2>
                                    <p className="text-sm text-slate-400">Keluaran dari simulasi akan muncul di sini.</p>
                                </div>

                                <div className="flex-1 rounded-xl bg-white/5 border border-dashed border-white/10 p-4">
                                    {result ? (
                                        result
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                                            <Search className="w-12 h-12 opacity-20" />
                                            <p>Hasil akan ditampilkan di sini setelah menjalankan simulasi.</p>
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
