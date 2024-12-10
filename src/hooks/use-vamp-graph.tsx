import { GraphCanva } from "@/lib/types";
import { create } from "zustand";

interface VampGraph {
    canvas: GraphCanva[];
    addNewCanvas: (canva: GraphCanva) => void;
    updateCanvas: (id: string, canva: GraphCanva) => void;
    current: string;
    setCurrent: (id: string) => void;
}

export const useVampGraph = create<VampGraph>((set, get) => ({
    canvas: [],
    addNewCanvas: (canva) => {
        set({ canvas: [...get().canvas, canva] });
    },
    updateCanvas: (id, canva) => {
        set({
            canvas: get().canvas.map((item) => {
                if (item.id === id) {
                    return canva;
                }
                return item;
            }),
        });
    },
    current: "",
    setCurrent: (id) => {
        set({ current: id });
    },
}));
