import { MSTSolution } from '@/lib/types';
import * as Heap from 'heap-js';

// Define the graph type
interface Graph {
    [node: string]: {
        [neighbor: string]: number
    }
}

// Define the edge type
type Edge = [string, string, number];

export function prim(graph: Graph, startNode: string) : MSTSolution {
    // Set to track visited nodes
    const visited = new Set<string>();
    
    // List to store MST edges
    const mst: Edge[] = [];
    
    // Total cost of the minimum spanning tree
    let totalCost = 0;

    // Create a min heap for edge selection
    const minHeap = new Heap.default<[number, string, string | null]>((a, b) => a[0] - b[0]);
    
    // Start with the initial node
    minHeap.push([0, startNode, null]);

    while (!minHeap.isEmpty()) {
        // Get the edge with minimum weight
        const [weight, currentNode, prevNode] = minHeap.pop()!;

        // Skip if node already visited
        if (visited.has(currentNode)) {
            continue;
        }

        // Mark node as visited
        visited.add(currentNode);

        // If not the start node, add edge to MST
        if (prevNode !== null) {
            mst.push([
                prevNode,
                currentNode,
                weight
            ]);
            totalCost += weight;
        }

        // Examine neighboring nodes
        for (const [neighbor, edgeWeight] of Object.entries(graph[currentNode])) {
            if (!visited.has(neighbor)) {
                minHeap.push([edgeWeight, neighbor, currentNode]);
            }
        }
    }

    return { tree: mst, totalCost };
}

