'use server';
/**
 * @fileOverview Alur (Flow) untuk mensimulasikan berbagai metode Temu Kembali Informasi (Information Retrieval).
 * 
 * [UPDATED] Menggunakan Backend Python Flask untuk pemrosesan NLP yang lebih akurat (Sastrawi, Scikit-learn).
 */

import { IrInputSchema, type IrInput, type IrOutput } from './ir-schemas';

export async function simulateIrMethod(input: IrInput): Promise<IrOutput> {
    try {
        const FLASK_API_URL = 'http://127.0.0.1:5000/api/simulate';

        const response = await fetch(FLASK_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
            cache: 'no-store' // Ensure we don't cache RPC calls
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Backend Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data as IrOutput;

    } catch (error: any) {
        console.error("Gagal menghubungi backend Python:", error);

        // Fallback or User Friendly Error
        if (error.cause?.code === 'ECONNREFUSED') {
            return {
                error: "Gagal terhubung ke server Python. Pastikan Anda telah menjalankan 'python backend/app.py'."
            };
        }

        return { error: error.message || "Terjadi kesalahan internal saat memproses permintaan." };
    }
}
