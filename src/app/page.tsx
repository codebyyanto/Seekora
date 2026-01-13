import { Navbar } from "@/components/ui/Navbar";
import { Button } from "@/components/ui/button";

import {
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col font-sans selection:bg-seekora-primary/30">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 min-h-[90vh] flex items-center justify-center">
        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div className="space-y-8 animate-[fade-in_0.8s_ease-out]">

            <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
              Seekora <span className="text-slate-500">—</span> <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-seekora-primary via-seekora-accent to-pink-500">
                Information Retrieval Lab
              </span>
            </h1>

            <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
              Laboratorium Digital untuk Eksplorasi Temu Kembali Informasi.
              Pelajari cara kerja mesin pencari mulai dari Boolean, VSM, hingga BM25 secara visual dan interaktif.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/methods">
                <Button size="lg" className="rounded-full px-8 text-base shadow-[0_0_30px_-5px_rgba(59,130,246,0.6)] hover:shadow-[0_0_40px_-5px_rgba(59,130,246,0.8)] transition-shadow">
                  Mulai Eksplorasi
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>

            </div>
          </div>

          {/* Right Visual (Abstract Dashboard) */}
          <div className="relative lg:block glass-card p-6 aspect-video animate-[slide-up_1s_ease-out]">
            {/* Mock UI Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-seekora-primary/5 to-seekora-accent/5" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="h-2 w-20 bg-white/10 rounded-full" />
              </div>

              <div className="grid grid-cols-3 gap-4 h-full">
                {/* Graph Area */}
                <div className="col-span-2 space-y-2">
                  <div className="h-32 rounded-lg bg-gradient-to-tr from-seekora-primary/20 to-transparent border border-seekora-primary/20 flex items-center justify-center relative overflow-hidden">
                    {/* Mock Graph Lines */}
                    <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 100 50" preserveAspectRatio="none">
                      <path d="M0,50 Q25,10 50,30 T100,5" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <circle cx="100" cy="5" r="3" fill="#8b5cf6" />
                    </svg>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-10 w-full bg-white/5 rounded" />
                    <div className="h-10 w-full bg-white/5 rounded" />
                  </div>
                </div>
                {/* Sidebar Area */}
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-8 w-full bg-white/5 rounded flex items-center px-2">
                      <div className="h-2 w-2 rounded-full bg-seekora-accent" />
                      <div className="ml-2 h-2 w-12 bg-white/10 rounded" />
                    </div>
                  ))}
                  <div className="mt-4 p-2 glass rounded-lg border border-seekora-accent/30">
                    <div className="flex justify-end space-x-1">
                      <div className="text-yellow-400 text-xs">★</div>
                      <div className="text-yellow-400 text-xs">★</div>
                      <div className="text-yellow-400 text-xs">★</div>
                    </div>
                    <div className="mt-2 flex items-end justify-between h-10 px-1">
                      <div className="w-2 bg-seekora-primary h-[40%] rounded-t" />
                      <div className="w-2 bg-seekora-primary h-[70%] rounded-t" />
                      <div className="w-2 bg-seekora-primary h-[30%] rounded-t" />
                      <div className="w-2 bg-seekora-accent h-[100%] rounded-t" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Seekora | Laboratorium Interaktif Temu Kembali Informasi</p>

      </footer>
    </main >
  );
}
