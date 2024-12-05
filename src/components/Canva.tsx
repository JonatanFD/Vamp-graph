import { useVampGraph } from "@/hooks/use-vamp-graph";
import { Graph, GraphCanva } from "@/lib/types";
import { randomBetween } from "@/lib/utils";
import { KonvaEventObject } from "konva/lib/Node";
import { ArrowUpRight, Circle, Mouse } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Stage, Layer } from "react-konva";
import { Button } from "./ui/button";
import { Tooltip } from "@radix-ui/react-tooltip";
import { TooltipContent, TooltipTrigger } from "./ui/tooltip";
import Edge from "./canva-elements/Edge";
import Node from "./canva-elements/Node";
import NoCanva from "./NoCanva";
import SolutionPicker from "./canva-elements/SolutionPicker";
import { useGraphSolution } from "@/hooks/use-graph-solution";

export interface CanvaGraphNode {
    title: string;
    x: number;
    y: number;
}

export interface GraphNodesPosition {
    [key: string]: CanvaGraphNode;
}

const getNodes = (graph: Graph) => {
    const nodes: CanvaGraphNode[] = [];
    const names = Object.keys(graph);

    const dict: GraphNodesPosition = {};

    names.forEach((name) => {
        const node: CanvaGraphNode = {
            title: name,
            x: randomBetween(0, window.innerWidth - 10) + 5,
            y: randomBetween(0, window.innerHeight - 10) + 5,
        };
        nodes.push(node);
        dict[name] = node;
    });
    return { nodes, dict };
};

export interface GraphLine {
    from: CanvaGraphNode;
    to: CanvaGraphNode;
    weight: number;
    type: "directed" | "undirected";
    selected: boolean;
}

const getEdges = (graph: Graph, dict: GraphNodesPosition) => {
    const lines = [];
    const nameSet = new Set<string>();

    for (const from in graph) {
        for (const to in graph[from]) {
            const codeFromTo = from + "-" + to;
            const codeToFrom = to + "-" + from;
            if (nameSet.has(codeFromTo)) continue;
            if (nameSet.has(codeToFrom)) continue;

            nameSet.add(codeFromTo);

            const weight = graph[from][to];
            const line: GraphLine = {
                from: dict[from],
                to: dict[to],
                weight,
                type: "directed",
                selected: false,
            };

            if (from === to) continue;

            if (graph[to][from] !== undefined) {
                nameSet.add(codeToFrom);
                line.type = "undirected";
            }

            lines.push(line);
        }
    }
    return lines;
};

export type CanvaTool = "addnode" | "connect" | "select";
export interface ToolBarItem {
    name: CanvaTool;
    icon: React.ReactNode;
    tooltip: string;
}

export default function Canva() {
    const { canvas, current } = useVampGraph();
    const [nodes, setNodes] = useState<CanvaGraphNode[]>([]);
    const [edges, setEdges] = useState<GraphLine[]>([]);

    const [tool, setTool] = useState<CanvaTool>("select");

    const { step, solution } = useGraphSolution();

    // zoom
    const handleZoom = useCallback((e: KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();
        const scaleBy = 1.2;
        const stage = e.target.getStage();
        if (!stage) return;

        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();
        if (!pointer) return;

        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };

        let direction = e.evt.deltaY > 0 ? 1 : -1;
        if (e.evt.ctrlKey) {
            direction = -direction;
        }

        const newScale =
            direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
        stage.scale({ x: newScale, y: newScale });
        stage.position({
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        });
    }, []);

    const handleCircleDrag = useCallback(
        (e: KonvaEventObject<MouseEvent>, circle: CanvaGraphNode) => {
            setEdges((prev) => {
                const newEdges = prev.map((edge) => {
                    if (edge.from.title === circle.title) {
                        return {
                            ...edge,
                            from: {
                                ...edge.from,
                                x: e.target.attrs.x,
                                y: e.target.attrs.y,
                            },
                        };
                    }
                    if (edge.to.title === circle.title) {
                        return {
                            ...edge,
                            to: {
                                ...edge.to,
                                x: e.target.attrs.x,
                                y: e.target.attrs.y,
                            },
                        };
                    }
                    return edge;
                });
                return newEdges;
            });

            setNodes((prev) => {
                const newNodes = prev.map((node) => {
                    if (node.title === circle.title) {
                        return {
                            ...node,
                            x: e.target.attrs.x,
                            y: e.target.attrs.y,
                        };
                    }
                    return node;
                });
                return newNodes;
            });
        },
        []
    );

    const TOOLS: ToolBarItem[] = [
        {
            name: "select",
            icon: <Mouse />,
            tooltip: "Select",
        },
        {
            name: "addnode",
            icon: <Circle />,
            tooltip: "Add Node",
        },
        {
            name: "connect",
            icon: <ArrowUpRight />,
            tooltip: "Connect Nodes",
        },
    ];

    useEffect(() => {
        const currentgraph = canvas.find(
            (item) => item.id === current
        ) as GraphCanva;
        if (!currentgraph) return;

        console.log("currentgraph", currentgraph);

        const { nodes: genNodes, dict } = getNodes(currentgraph.graph);
        setNodes(genNodes);

        const edges = getEdges(currentgraph.graph, dict);
        console.log("Lines", edges);

        setEdges(edges);
    }, [current]);

    useEffect(() => {
        if (step === -1) return;

        const getStep = (step: number) => {
            const tree = solution.solution.tree;
            console.log(tree[step]);

            const matches = new Set<string>();
            for (let i = 0; i < step + 1; i++) {
                matches.add(tree[i][0] + tree[i][1]);
                matches.add(tree[i][1] + tree[i][0]);
            }

            return matches;
        };
        const combinations = getStep(step);

        setEdges((prev) => {
            const newEdges = prev.map((edge) => {
                const edgeKey = edge.from.title + edge.to.title;
                if (!combinations.has(edgeKey)) {
                    edge.selected = false;
                    return edge;
                }

                edge.selected = true;
                return edge;
            });
            return newEdges;
        });
    }, [step]);

    return (
        <main className="w-full relative">
            {current === "" ? (
                <NoCanva />
            ) : (
                <>
                    {canvas.find((item) => item.id === current) && (
                        <Stage
                            width={window.innerWidth}
                            height={window.innerHeight}
                            draggable
                            onWheel={handleZoom}
                            className="absolute"
                        >
                            <Layer>
                                <Edge edges={edges} />
                                <Node
                                    nodes={nodes}
                                    handleCircleDrag={handleCircleDrag}
                                />
                            </Layer>
                        </Stage>
                    )}
                    <section className="absolute left-0 right-0 bottom-0 w-fit mx-auto mb-4 flex items-center gap-4">
                        <ul className="flex gap-3 bg-secondary p-2 rounded-xl">
                            {TOOLS.map((item) => {
                                return (
                                    <li key={item.name}>
                                        <Tooltip delayDuration={500}>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    size="icon"
                                                    onClick={() =>
                                                        setTool(item.name)
                                                    }
                                                    variant={
                                                        item.name === tool
                                                            ? "default"
                                                            : "ghost"
                                                    }
                                                >
                                                    {item.icon}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{item.tooltip}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </li>
                                );
                            })}
                        </ul>

                        <SolutionPicker />
                    </section>
                </>
            )}
        </main>
    );
}
