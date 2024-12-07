// Define the graph structure with a more explicit type
export interface Graph {
    [node: string]: {
        [neighbor: string]: number;
    };
}

// Explicitly define the tuple type for a single step
export type FordFulkersonStep = readonly [string, string, number];

// Define the flow type as an array of steps
export type FordFulkersonFlow = ReadonlyArray<FordFulkersonStep>;

// Define the solution interface with immutable properties
export interface FordFulkersonSolution {
    totalCost: number;
    steps: ReadonlyArray<FordFulkersonFlow>;
}

function BFS(
    graph: Graph, 
    s: string, 
    t: string, 
    parent: Map<string, string | null>
): boolean {
    const visited = new Set<string>();
    const queue: string[] = [s];
    visited.add(s);

    while (queue.length > 0) {
        const u = queue.shift()!;

        for (const [neighbor, capacity] of Object.entries(graph[u] || {})) {
            if (!visited.has(neighbor) && capacity > 0) {
                queue.push(neighbor);
                visited.add(neighbor);
                parent.set(neighbor, u);
            }
        }
    }

    return visited.has(t);
}

export function ford_fulkerson(
    graph: Graph, 
    source: string, 
    sink: string
): FordFulkersonSolution {
    // Create a deep copy of the graph to modify
    const residualGraph: Graph = JSON.parse(JSON.stringify(graph));

    // Initialize parent mapping
    const parent = new Map<string, string | null>();
    let maxFlow = 0;

    // Array to store all augmenting paths
    const augmentingPaths: FordFulkersonFlow[] = [];

    while (true) {
        // Reset parent for each BFS
        parent.clear();

        // Find an augmenting path
        if (!BFS(residualGraph, source, sink, parent)) {
            break;
        }

        // Find minimum flow on the path
        let pathFlow = Infinity;
        let currentNode = sink;
        const path: string[] = [sink];
        const pathWithFlows: FordFulkersonStep[] = [];

        while (currentNode !== source) {
            const prevNode = parent.get(currentNode)!;
            pathFlow = Math.min(pathFlow, residualGraph[prevNode][currentNode]);

            // Store each edge with its flow
            pathWithFlows.unshift([
                prevNode,
                currentNode,
                residualGraph[prevNode][currentNode],
            ]);

            currentNode = prevNode;
            path.unshift(currentNode);
        }

        // Add this path to augmenting paths
        augmentingPaths.push(pathWithFlows);

        // Update residual graph
        currentNode = sink;
        while (currentNode !== source) {
            const prevNode = parent.get(currentNode)!;

            // Reduce capacity on forward edge
            residualGraph[prevNode][currentNode] -= pathFlow;

            // Add capacity to backward edge if it doesn't exist
            if (!residualGraph[currentNode]) {
                residualGraph[currentNode] = {};
            }
            residualGraph[currentNode][prevNode] =
                (residualGraph[currentNode][prevNode] || 0) + pathFlow;

            currentNode = prevNode;
        }

        maxFlow += pathFlow;
    }

    return {
        totalCost: maxFlow,
        steps: augmentingPaths,
    };
}