import { Graph, MSTSolution } from "@/lib/types";

function estanConectados(p: string, q: string, list: string[], ids: string[]): boolean {
    const pIndex = list.indexOf(p);
    const qIndex = list.indexOf(q);

    return ids[pIndex] === ids[qIndex];
}

function union(p: string, q: string, list: string[], ids: string[]): void {
    const pIndex = list.indexOf(p);
    const qIndex = list.indexOf(q);

    const lider = ids[pIndex];
    const target = ids[qIndex];

    for (let i = 0; i < ids.length; i++) {
        if (ids[i] === target) {
            ids[i] = lider;
        }
    }
}

function findUnion(p: string, q: string, list: string[], ids: string[]): boolean {
    if (!estanConectados(p, q, list, ids)) {
        union(p, q, list, ids);
        return true;
    }

    return false;
}

function insertarOrdenado(cola: [string, string, number][], v: [string, string, number]): void {
    let i = 0;
    while (i < cola.length && cola[i][2] < v[2]) {
        i++;
    }

    cola.splice(i, 0, v);
}

function ordenarAristas(grafo: { [key: string]: { [key: string]: number } }): [string, string, number][] {
    const cola: [string, string, number][] = [];
    
    for (const v in grafo) {
        for (const w in grafo[v]) {
            insertarOrdenado(cola, [v, w, grafo[v][w]]);
        }
    }

    return cola;
}

export function kruskal(grafo: Graph) : MSTSolution {
    const aristas = ordenarAristas(grafo);
    const ids = Object.keys(grafo);
    const representantes = [...ids];

    let pesoTotal = 0;
    const tree: [string, string, number][] = [];

    for (const [v, w, peso] of aristas) {
        if (findUnion(v, w, representantes, ids)) {
            tree.push([v, w, peso]);
            pesoTotal += peso;
        }
    }

    console.log(`Peso total: ${pesoTotal}`);
    console.log("Tree: ");
    for (const [v, w, peso] of tree) {
        console.log(`${v} -> ${w}: ${peso}`);
    }

    return { tree, totalCost: pesoTotal };
}

