import { MSTSolution } from "@/lib/types";
import { FordFulkersonSolution } from "@/utils/algorithms/ford-fulkerson";
import { create } from "zustand";

type SolutionState = {
    algorithm: Algorithm;
    solution: MSTSolution | FordFulkersonSolution;
};

export type Algorithm = "prim" | "kruskal" | "maxflow" | "";

export interface GraphSolution {
    solution: SolutionState;
    setSolution: (sol: SolutionState) => void;

    step: number;
    setStep: (step: number) => void;

    row: number;
    setRow: (row: number) => void;
}

export const useGraphSolution = create<GraphSolution>((set) => ({
    solution: { algorithm: "", solution: {
        tree: [],
        totalCost: 0,
        steps: [],
    } },
    setSolution: (sol: SolutionState) =>
        set({
            solution: sol,
        }),
    step: -1,
    setStep: (step: number) => set({ step }),
    row: -1,
    setRow: (row: number) => set({ row }),
}));
