import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Seekora - Lab IR Interaktif",
  description: "Laboratorium Digital untuk Eksplorasi Temu Kembali Informasi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={cn(
          "min-h-screen bg-transparent antialiased font-sans",
          inter.variable
        )}
      >
        <div className="relative min-h-screen overflow-x-hidden">
          {/* Background Gradients */}
          <div className="fixed inset-0 z-[-1] pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#3b82f6] rounded-full blur-[120px] opacity-20 animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#8b5cf6] rounded-full blur-[120px] opacity-20 animate-pulse" style={{ animationDelay: "2s" }} />
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
