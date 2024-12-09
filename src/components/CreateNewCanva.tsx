import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { GraphCanva, GraphPreset } from "@/lib/types";
import { useVampGraph } from "@/hooks/use-vamp-graph";
import { createGraph } from "@/utils/graph";
import { useGraphSolution } from "@/hooks/use-graph-solution";
import { kruskal } from "@/utils/algorithms/kruskal";
import { ford_fulkerson } from "@/utils/algorithms/ford-fulkerson";

const CanvaFormSchema = z.object({
    title: z.string().min(2).max(50),
    nodes: z.coerce.number().min(2).max(100),
    preset: z.string().min(2).max(50),
    minWeight: z.coerce.number(),
    maxWeight: z.coerce.number(),
});

export function CreateNewCanva() {
    const formState = useForm<z.infer<typeof CanvaFormSchema>>({
        resolver: zodResolver(CanvaFormSchema),
        defaultValues: {
            title: "",
            nodes: 10,
            preset: "directed",
            minWeight: 1,
            maxWeight: 10,
        },
    });

    const { addNewCanvas, setCurrent } = useVampGraph();
    const { setSolution } = useGraphSolution();

    const { handleSubmit } = formState;
    const onSubmit = handleSubmit((data) => {
        const newCanva: GraphCanva = {
            title: data.title,
            id: (() => crypto.randomUUID())(),
            data: {
                preset: data.preset as GraphPreset,
                minWeight: data.minWeight,
                maxWeight: data.maxWeight,
                nodes: data.nodes,
                ponderate: false,
            },
            graph: {},
        };

        const graph = createGraph(newCanva);
        newCanva.graph = graph;
        addNewCanvas(newCanva);
        setCurrent(newCanva.id);

        const names = Object.keys(newCanva.graph);
        const algorithm = data.preset === "undirected" ? "kruskal" : "maxflow";
        const solution =
            algorithm === "kruskal"
                ? kruskal(newCanva.graph)
                : ford_fulkerson(
                      newCanva.graph,
                      names[0],
                      names[names.length - 1]
                  );
        setSolution({ algorithm, solution });
    });

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className="p-1 h-fit">
                    <Plus size={16} />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <Form {...formState}>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <DialogHeader>
                            <DialogTitle>Create a new canvas</DialogTitle>
                            <DialogDescription>
                                Customize your canvas as you want
                            </DialogDescription>
                        </DialogHeader>

                        {/* Title */}
                        <FormField
                            name="title"
                            control={formState.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your title"
                                            type="text"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        ></FormField>

                        <FormField
                            name="preset"
                            control={formState.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Graph Type</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="directed">
                                                    Directed
                                                </SelectItem>
                                                <SelectItem value="undirected">
                                                    Undirected
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </FormItem>
                            )}
                        ></FormField>

                        <section className="flex gap-4">
                            <FormField
                                name="nodes"
                                control={formState.control}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Nodes</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={2}
                                                max={50}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            ></FormField>
                            <FormField
                                name="minWeight"
                                control={formState.control}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Min Edge Weight</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={-50}
                                                max={50}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            ></FormField>
                            <FormField
                                name="maxWeight"
                                control={formState.control}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Max Edge Weight</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={-50}
                                                max={50}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            ></FormField>
                        </section>
                        <DialogClose asChild>
                            <Button className="w-full" type="submit">
                                Create
                            </Button>
                        </DialogClose>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
