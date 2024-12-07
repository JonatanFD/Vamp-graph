import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { kruskal } from "@/utils/algorithms/kruskal";
import { useVampGraph } from "@/hooks/use-vamp-graph";
import { useGraphSolution } from "@/hooks/use-graph-solution";
import { GraphCanva } from "@/lib/types";
import { prim } from "@/utils/algorithms/prim";
import { ford_fulkerson } from "@/utils/algorithms/ford-fulkerson";
import { SidebarGroup, SidebarGroupLabel } from "../ui/sidebar";

export default function SolutionPicker() {
    const { canvas, current } = useVampGraph();
    const { setSolution, solution, setStep } = useGraphSolution();

    const handleAlgorithmChange = (value: string) => {
        const currentGraph = canvas.find(
            (el) => (el.id = current)
        ) as GraphCanva;

        if (value === "kruskal") {
            const result = kruskal(currentGraph.graph);

            if (!result) return;

            setSolution({
                algorithm: value,
                solution: result,
            });
        } else if (value === "prim") {
            const result = prim(
                currentGraph.graph,
                Object.keys(currentGraph.graph)[0]
            );
            if (!result) return;

            setSolution({
                algorithm: value,
                solution: result,
            });
        } else if (value === "maxflow") {
            const names = Object.keys(currentGraph.graph);

            const result = ford_fulkerson(
                currentGraph.graph,
                names[0],
                names[names.length - 1]
            );
            if (!result) return;

            setSolution({
                algorithm: value,
                solution: result,
            });
            setStep(-1);
        }
        setStep(-1);
    };

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Algorithm</SidebarGroupLabel>
            <Select
                defaultValue={solution.algorithm}
                onValueChange={handleAlgorithmChange}
            >
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="kruskal">Kruskal</SelectItem>
                    <SelectItem value="prim">Prim</SelectItem>
                    <SelectItem value="maxflow">Ford Fulkerson</SelectItem>
                    <SelectItem value="astar">A Star</SelectItem>
                    <SelectItem value="bellman">Bellman Ford</SelectItem>
                </SelectContent>
            </Select>
        </SidebarGroup>
    );
}
