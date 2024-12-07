import { Graph, GraphCanva } from "@/lib/types";
import { randomBetween } from "@/lib/utils";

function intializeGraph(nodes: number) {
    const graph: Graph = {};
    for (let i = 0; i < nodes; i++) {
        const name = i.toString();
        graph[name] = {};
    }
    return graph;
}

export function createGraph(data: GraphCanva) {
    const { preset, minWeight, maxWeight, nodes: nodesAmount } = data.data;

    const graph = intializeGraph(nodesAmount);

    for (const from in graph) {
        for (const to in graph) {
            if (from === to) continue;
            if (
                Object.keys(graph[from]).length >= 3 ||
                Object.keys(graph[to]).length >= 3
            )
                continue;
            const probability = randomBetween(0, 100);
            const weight = randomBetween(minWeight, maxWeight);

            if (preset === "directed") {
                if (graph[to][from]) {
                    continue;
                } else if (probability < 37) {
                    graph[from][to] = weight;
                }
            } else if (preset === "undirected") {
                if (probability < 37) {
                    graph[from][to] = weight;
                    graph[to][from] = weight;
                }
            }
        }
    }

    return graph;
}
