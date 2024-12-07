export interface Graph {
    [nodeName: string]: {
        [nodeName: string]: number;
    };
}

export interface GraphCanva {
    id: string;
    title: string;
    data: GraphForm;
    graph: Graph;
}

export interface GraphForm {
    nodes: number;
    minWeight: number;
    maxWeight: number;
    ponderate: boolean;
    preset: GraphPreset;
}

export type GraphPreset =
    | "directed"
    | "undirected"
    | "mst"
    | "maxflow"
    | "bellman-ford"
    | "prim"
    | "kruskal"
    | "astar"
    | "floyd-warshall";

export type MSTStep =  [string, string, number];

export interface MSTSolution {
    tree: MSTStep[];
    totalCost: number;
}