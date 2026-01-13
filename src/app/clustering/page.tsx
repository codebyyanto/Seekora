"use client";

import { Navbar } from "@/components/ui/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Hexagon, Upload, AlertCircle, Layers, Play, ArrowLeft } from "lucide-react";
import { useState, useRef } from "react";
import { simulateIrMethod } from "@/actions/simulate-ir";
import Link from "next/link";

type ClusterResult = {
    clusterId: number;
    docs: { id: number; content: string }[];
    centroid: string[]; // representative terms
};

export default function ClusteringPage() {
    const [k, setK] = useState("3");
    const [corpus, setCorpus] = useState("");
    const [clusters, setClusters] = useState<ClusterResult[] | null>(null);
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

    const handleClustering = async () => {
        setError("");
        setClusters(null);

        const kNum = parseInt(k);
        if (isNaN(kNum) || kNum < 2) {
            setError("Jumlah cluster (K) minimal 2.");
            return;
        }
        if (!corpus.trim()) {
            setError("Masukkan dokumen.");
            return;
        }

        try {
            const output = await simulateIrMethod({
                methodId: "clustering",
                query: k, // Using query field to pass 'k'
                documents: corpus
            });

            if (output.error) {
                setError(output.error);
                return;
            }

            if (output.clusters) {
                const resultClusters: ClusterResult[] = Object.keys(output.clusters).map(key => {
                    const docs = output.clusters![key];
                    return {
                        clusterId: parseInt(key) + 1,
                        docs: docs.map(d => ({ id: d.docId, content: d.content })),
                        centroid: [] // Centroid terms are not explicitly returned in the simple output, we can omit or handle differently.
                    };
                });
                setClusters(resultClusters);
            }

        } catch (e) {
            setError("Gagal melakukan clustering.");
        }
    };

    return (
        <main className="min-h-screen flex flex-col font-sans selection:bg-seekora-primary/30">
            <Navbar />

            <div className="flex-1 px-6 pt-32 pb-20">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Back Button */}
                    <Link href="/methods">
                        <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-orange-400 mb-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali ke Metode
                        </Button>
                    </Link>

                    {/* Header */}
                    <div className="glass-card p-8 border-l-4 border-l-orange-500 space-y-2">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <Hexagon className="w-6 h-6 text-emerald-500" />
                            </div>
                            <h1 className="text-2xl font-bold">Clustering Dokumen</h1>
                        </div>
                        <p className="text-slate-400 pl-14">
                            Secara otomatis mengelompokkan dokumen serupa ke dalam cluster menggunakan algoritma K-Means.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Input */}
                        <div className="glass-card p-6 space-y-6">
                            <div className="space-y-2">
                                <h2 className="text-lg font-semibold">Input Simulasi</h2>
                                <p className="text-sm text-slate-400">Algoritma Unsupervised Learning (K-Means)</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Jumlah Cluster (K)</label>
                                <Input
                                    value={k}
                                    onChange={(e) => setK(e.target.value)}
                                    className="font-mono text-emerald-400 w-24"
                                    type="number"
                                    min="2"
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
                                    placeholder="Tempel koleksi dokumen..."
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
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                                size="lg"
                                onClick={handleClustering}
                            >
                                Jalankan Simulasi
                            </Button>
                        </div>

                        {/* Result */}
                        <div className="glass-card p-6 h-full min-h-[500px] flex flex-col">
                            <div className="space-y-1 mb-6">
                                <h2 className="text-lg font-semibold">Hasil Clustering</h2>
                                <p className="text-sm text-slate-400">Pengelompokan otomatis berdasarkan kemiripan konten.</p>
                            </div>

                            <div className="flex-1 rounded-xl bg-white/5 border border-dashed border-white/10 p-4 overflow-y-auto max-h-[600px] custom-scrollbar">
                                {clusters ? (
                                    <div className="space-y-6">
                                        {clusters.map((cluster) => (
                                            <div key={cluster.clusterId} className="space-y-3">
                                                <div className="flex items-center space-x-2">
                                                    <div className="h-8 px-3 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center font-bold text-sm">
                                                        Cluster {cluster.clusterId}
                                                    </div>
                                                    <div className="text-xs text-slate-500 font-mono">
                                                        Top Terms: {cluster.centroid.join(", ")}
                                                    </div>
                                                </div>

                                                <div className="grid gap-3 pl-4 border-l-2 border-white/10">
                                                    {cluster.docs.map((doc) => (
                                                        <div key={doc.id} className="p-3 rounded bg-black/40 border border-white/5 text-sm text-slate-300">
                                                            <span className="text-emerald-500 font-bold mr-2">#{doc.id}</span>
                                                            "{doc.content}"
                                                        </div>
                                                    ))}
                                                    {cluster.docs.length === 0 && (
                                                        <div className="text-xs text-slate-600 italic">Cluster kosong</div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4 opacity-50">
                                        <Layers className="w-12 h-12" />
                                        <p>Jalankan simulasi untuk melihat hasil pengelompokan.</p>
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
