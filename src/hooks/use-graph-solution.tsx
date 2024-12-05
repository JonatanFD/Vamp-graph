import { create } from "zustand";

export interface SolutionState {
    algorithm: string;
    solution: object;
}

export interface GraphSolution {
    solution: SolutionState;
    setSolution: (sol: SolutionState) => void;

    step: number;
    setStep: (step: number) => void;
}

export const useGraphSolution = create<GraphSolution>((set) => ({
    solution: { algorithm: "", solution: {} },
    setSolution: (sol: SolutionState) =>
        set({
            solution: sol,
        }),
    step: -1,
    setStep: (step: number) => set({ step }),
}));
