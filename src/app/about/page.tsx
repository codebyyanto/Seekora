import { Navbar } from "@/components/ui/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Github, Code2, GraduationCap, Library } from "lucide-react";

export default function AboutPage() {
    return (
        <main className="min-h-screen pt-32 px-6 pb-20 font-sans selection:bg-seekora-primary/30">
            <Navbar />

            <div className="max-w-4xl mx-auto space-y-16">
                {/* Header */}
                <section className="text-center space-y-6">

                    <h1 className="text-4xl md:text-5xl font-bold">
                        Tentang <span className="bg-clip-text text-transparent bg-gradient-to-r from-seekora-primary to-seekora-accent">Seekora</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Platform edukasi interaktif yang dirancang untuk menjembatani teori dan praktik dalam bidang Information Retrieval (Temu Kembali Informasi).
                    </p>
                </section>

                {/* Mission & Vision */}
                <section className="grid md:grid-cols-2 gap-8">
                    <div className="glass-card p-8 space-y-4 border-l-4 border-l-seekora-primary">
                        <div className="h-10 w-10 rounded-lg bg-seekora-primary/20 flex items-center justify-center text-seekora-primary">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold">Misi Edukasi</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Memberikan pengalaman belajar yang visual dan langsung (hands-on) bagi mahasiswa untuk memahami algoritma pencarian yang kompleks seperti VSM, BM25, dan Clustering.
                        </p>
                    </div>
                    <div className="glass-card p-8 space-y-4 border-l-4 border-l-seekora-accent">
                        <div className="h-10 w-10 rounded-lg bg-seekora-accent/20 flex items-center justify-center text-seekora-accent">
                            <Library className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold">Laboratorium Digital</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Menyediakan lingkungan simulasi yang aman dan terisolasi untuk bereksperimen dengan teknik pengindeksan, pemrosesan kueri, dan evaluasi sistem.
                        </p>
                    </div>
                </section>

                {/* Tech Stack */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-center">Teknologi di Balik Seekora</h2>
                    <div className="glass-card p-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            {/* Next.js */}
                            <div className="space-y-4 group p-4 rounded-xl hover:bg-white/5 transition-all duration-300">
                                <div className="mx-auto w-16 h-16 rounded-2xl bg-black border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-white/30 group-hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] transition-all duration-300 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <svg viewBox="0 0 180 180" className="w-8 h-8 fill-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all">
                                        <mask height="180" id="mask0_408_134" maskUnits="userSpaceOnUse" width="180" x="0" y="0" style={{ maskType: 'alpha' }}>
                                            <circle cx="90" cy="90" fill="black" r="90" />
                                        </mask>
                                        <g mask="url(#mask0_408_134)">
                                            <circle cx="90" cy="90" data-circle="true" fill="black" r="90" stroke="white" strokeWidth="6px" />
                                            <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="url(#paint0_linear_408_134)" />
                                            <rect fill="url(#paint1_linear_408_134)" height="72" width="12" x="115" y="54" />
                                        </g>
                                        <defs>
                                            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_408_134" x1="109" x2="144.5" y1="116.5" y2="160.5">
                                                <stop stopColor="white" />
                                                <stop offset="1" stopColor="white" stopOpacity="0" />
                                            </linearGradient>
                                            <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_408_134" x1="121" x2="120.799" y1="54" y2="106.875">
                                                <stop stopColor="white" />
                                                <stop offset="1" stopColor="white" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold group-hover:text-white transition-colors">Next.js 14</h4>
                                    <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">App Router & SSR</p>
                                </div>
                            </div>

                            {/* Tailwind CSS */}
                            <div className="space-y-4 group p-4 rounded-xl hover:bg-cyan-500/5 transition-all duration-300">
                                <div className="mx-auto w-16 h-16 rounded-2xl bg-[#0B1120] border border-cyan-500/20 flex items-center justify-center group-hover:scale-110 group-hover:border-cyan-400/50 group-hover:shadow-[0_0_20px_-5px_rgba(6,182,212,0.4)] transition-all duration-300 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#38BDF8] group-hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.6)] transition-all">
                                        <path fill="currentColor" d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" />
                                    </svg>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold group-hover:text-cyan-400 transition-colors">Tailwind CSS</h4>
                                    <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">Utility-first Styling</p>
                                </div>
                            </div>

                            {/* TypeScript */}
                            <div className="space-y-4 group p-4 rounded-xl hover:bg-blue-600/5 transition-all duration-300">
                                <div className="mx-auto w-16 h-16 rounded-2xl bg-[#3178C6]/10 border border-[#3178C6]/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#3178C6] group-hover:border-[#3178C6] group-hover:shadow-[0_0_20px_-5px_rgba(49,120,198,0.5)] transition-all duration-300 relative overflow-hidden">
                                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#3178C6] group-hover:text-white transition-all">
                                        <path fill="currentColor" d="M17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" />
                                    </svg>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold group-hover:text-blue-500 transition-colors">TypeScript</h4>
                                    <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">Type Safety</p>
                                </div>
                            </div>

                            {/* Framer Motion */}
                            <div className="space-y-4 group p-4 rounded-xl hover:bg-pink-500/5 transition-all duration-300">
                                <div className="mx-auto w-16 h-16 rounded-2xl bg-black/40 border border-pink-500/30 flex items-center justify-center group-hover:scale-110 group-hover:border-pink-500/60 group-hover:shadow-[0_0_20px_-5px_rgba(236,72,153,0.4)] transition-all duration-300 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-pink-500 group-hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.6)] transition-all">
                                        <path fill="currentColor" d="M4,0h16v8h-8L4,0z M4,16h8l8-8H4V16z M4,24h8v-8L4,24z" />
                                    </svg>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold group-hover:text-pink-500 transition-colors">Framer Motion</h4>
                                    <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">Fluid Animations</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer / CTA */}

            </div>
        </main>
    );
}
