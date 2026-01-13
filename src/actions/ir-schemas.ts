import { z } from "zod";

export const IrInputSchema = z.object({
    methodId: z.enum(["regex", "vsm", "boolean", "bm25", "clustering", "relevance"]),
    query: z.string(),
    documents: z.string(),
});

export type IrInput = z.infer<typeof IrInputSchema>;

export type IrOutput = {
    matches?: { docId: number; name: string; content: string; highlights: [number, number][] }[];
    rankedDocuments?: { docId: number; name: string; score: number; content: string }[];
    matchedDocuments?: { docId: number; name: string; content: string }[];
    clusters?: { [key: string]: { docId: number; name: string; content: string }[] };
    numClusters?: number;
    inertia?: number;
    message?: string;
    error?: string;
};

export const IrOutputSchema = z.custom<IrOutput>();
