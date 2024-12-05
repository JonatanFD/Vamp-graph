import { Label } from "../ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { kruskal } from "@/utils/algorithms/kruskal";
import { useVampGraph } from "@/hooks/use-vamp-graph";
import { useGraphSolution } from "@/hooks/use-graph-solution";

export default function SolutionPicker() {
    const { canvas, current } = useVampGraph();
    const {setSolution, solution } = useGraphSolution()
    const [visible, setVisible] = useState(false);
    const [algorithm, setAlgorithm] = useState("kruskal");

    const handleShowSolution = () => {
        setVisible((prev) => !prev);

        if (algorithm) {
            const currentGraph = canvas.find((el) => (el.id = current));
            if (!currentGraph) return;

            const solution = kruskal(currentGraph.graph);
            if (!solution) return;

            console.log(solution);
            setSolution({
                algorithm,
                solution
            })
        }
    };

    return (
        <div className="flex gap-4 items-center">
            <div className="flex gap-4 items-center">
                <Label>Algorithm: </Label>
                <Select defaultValue={solution.algorithm} onValueChange={setAlgorithm}>
                    <SelectTrigger className="w-52">
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
            </div>

            <Tooltip delayDuration={500}>
                <TooltipTrigger asChild>
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={handleShowSolution}
                    >
                        {visible ? <EyeClosed /> : <Eye />}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{visible ? "Hide" : "Show"}</p>
                </TooltipContent>
            </Tooltip>
        </div>
    );
}
