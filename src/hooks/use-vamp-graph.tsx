import { GraphCanva } from "@/lib/types";
import { create } from "zustand";

interface VampGraph {
    canvas: GraphCanva[];
    addNewCanvas: (canva: GraphCanva) => void;
    current: string;
    setCurrent: (id: string) => void;
}

export const useVampGraph = create<VampGraph>((set, get) => ({
    canvas: [],
    addNewCanvas: (canva) => {
        set({ canvas: [...get().canvas, canva] });
    },
    current: "",
    setCurrent: (id) => {
        set({ current: id });
    },
}));
