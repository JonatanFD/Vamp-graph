import { ArrowDown, StepBack, StepForward } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { useGraphSolution } from "@/hooks/use-graph-solution";
import { useVampGraph } from "@/hooks/use-vamp-graph";
import { GraphCanva } from "@/lib/types";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Button } from "../ui/button";
import { ford_fulkerson, FordFulkersonSolution } from "@/utils/algorithms/ford-fulkerson";
import { SidebarMenuItem } from "../ui/sidebar";
import { Label } from "../ui/label";

const FordFormSchema = z.object({
    source: z.string(),
    target: z.string(),
});

export default function FordFulkerson() {
    const { setSolution, setStep, step, row, setRow, solution } = useGraphSolution();
    const { canvas, current } = useVampGraph();

    const currentGraph = canvas.find((el) => (el.id = current)) as GraphCanva;
    const formState = useForm<z.infer<typeof FordFormSchema>>({
        resolver: zodResolver(FordFormSchema),
        defaultValues: {
            source: Object.keys(currentGraph.graph)[0],
            target: Object.keys(currentGraph.graph)[
                Object.keys(currentGraph.graph).length - 1
            ],
        },
    });
    const onSubmit = formState.handleSubmit((data) => {
        const result = ford_fulkerson(
            currentGraph.graph,
            data.source,
            data.target
        );

        if (!result) return;

        setSolution({
            algorithm: "maxflow",
            solution: result,
        });
        setStep(-1);
    });
    const names = Object.keys(currentGraph.graph);


    const handleNextStep = () => {
        const sol = solution.solution as FordFulkersonSolution;
        if (sol.steps[row] === undefined) return;
        if (step === sol.steps[row].length - 1) return;
        setStep(step + 1);
    };

    const handlePrevStep = () => {
        if (step === -1) return;
        setStep(step - 1);
    };

    const handleNextRow = () => {
        const sol = solution.solution as FordFulkersonSolution;
        if (row === sol.steps.length - 1) return;
        setRow(row + 1);
        setStep(-1);
    };

    const handlePrevRow = () => {
        if (row === -1) return;
        setRow(row - 1);
        setStep(-1);
    };

    return (
        <>
            <SidebarMenuItem>
                <Form {...formState}>
                    <form className="px-2" onSubmit={onSubmit}>
                        <FormField
                            name="source"
                            control={formState.control}
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className="text-xs">
                                        Source
                                    </FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {names.map((item, index) => {
                                                    return (
                                                        <SelectItem
                                                            key={index}
                                                            value={item}
                                                        >
                                                            {item}
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </FormItem>
                            )}
                        ></FormField>

                        <ArrowDown className="mx-auto my-2" size={16} />
                        <FormField
                            name="target"
                            control={formState.control}
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className="text-xs">
                                        Target
                                    </FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {names.map((item, index) => {
                                                    return (
                                                        <SelectItem
                                                            key={index}
                                                            value={item}
                                                        >
                                                            {item}
                                                        </SelectItem>
                                                    );
                                                })}
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
                    <Label className="text-xs">Flow: </Label>
                </div>

                <div className="flex gap-1 flex-1 px-2 items-center">
                    <Button variant="outline" className="w-full" onClick={handlePrevRow}>
                        <StepBack />
                    </Button>

                    <span className="px-4">{row}</span>

                    <Button variant="outline" className="w-full" onClick={handleNextRow}>
                        <StepForward />
                    </Button>
                </div>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <div className="px-2 mb-3">
                    <Label className="text-xs">Step: </Label>
                </div>

                <div className="flex gap-1 flex-1 px-2 items-center">
                    <Button variant="outline" className="w-full" onClick={handlePrevStep}>
                        <StepBack />
                    </Button>

                    <span className="px-4">{step}</span>

                    <Button variant="outline" className="w-full" onClick={handleNextStep}>
                        <StepForward />
                    </Button>
                </div>
            </SidebarMenuItem>
            <Label className="text-xs">
                Total Flow: {solution.solution.totalCost}
            </Label>
        </>
    );
}
