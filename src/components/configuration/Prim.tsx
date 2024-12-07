import { useGraphSolution } from "@/hooks/use-graph-solution";
import { Label } from "../ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { SidebarMenuItem } from "../ui/sidebar";
import { useVampGraph } from "@/hooks/use-vamp-graph";
import { Button } from "../ui/button";
import { StepBack, StepForward } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { prim } from "@/utils/algorithms/prim";
import { GraphCanva, MSTSolution } from "@/lib/types";

const PrimFormSchema = z.object({
    origin: z.string(),
});

export default function Prim() {
    const { canvas, current } = useVampGraph();
    const {setSolution} = useGraphSolution();
    const nodeNames = Object.keys(
        canvas.find((el) => (el.id = current))?.graph as object
    );

    const formState = useForm<z.infer<typeof PrimFormSchema>>({
        resolver: zodResolver(PrimFormSchema),
        defaultValues: {
            origin: nodeNames[0],
        },
    });

    const onSubmit = formState.handleSubmit((data) => {
        const currentGraph = canvas.find(
            (el) => (el.id = current)
        ) as GraphCanva;

        const result = prim(currentGraph.graph, data.origin);
        if (!result) return;
        console.log("RESULT", result);
        
        setSolution({
            algorithm: "prim",
            solution: result,
        });
        setStep(-1);
    });

    const { solution, step, setStep } = useGraphSolution();

    const handleNextStep = () => {
        const sol = solution.solution as MSTSolution;
        if (step === sol.tree.length - 1) return;
        setStep(step + 1);
    };

    const handlePrevStep = () => {
        if (step === -1) return;
        setStep(step - 1);
    };

    return (
        <>
            <SidebarMenuItem>
                <Form {...formState}>
                    <form className="px-2" onSubmit={onSubmit}>
                        <FormField
                            name="origin"
                            control={formState.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Origin</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {nodeNames.map(
                                                    (item, index) => {
                                                        return (
                                                            <SelectItem
                                                                key={index}
                                                                value={item}
                                                            >
                                                                {item}
                                                            </SelectItem>
                                                        );
                                                    }
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </FormItem>
                            )}
                        ></FormField>
                        <Button
                            variant={"outline"}
                            size={"sm"}
                            className="w-full mt-3"
                        >
                            Calculate
                        </Button>
                    </form>
                </Form>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <div className="px-2 mb-3">
                    <Label className="text-xs">Step: </Label>
                </div>

                <div className="flex gap-1 flex-1 px-2 items-center">
                    <Button
                        onClick={handlePrevStep}
                        variant="outline"
                        className="w-full"
                    >
                        <StepBack />
                    </Button>

                    <span className="px-4">{step}</span>

                    <Button
                        onClick={handleNextStep}
                        variant="outline"
                        className="w-full"
                    >
                        <StepForward />
                    </Button>
                </div>
            </SidebarMenuItem>
        </>
    );
}
