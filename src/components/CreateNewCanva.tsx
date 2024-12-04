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
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
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

const CanvaFormSchema = z.object({
    title: z.string().min(2).max(50),
    nodes: z.number().min(2).max(100),
    preset: z.string().min(2).max(50),
    minWeight: z.number().int(),
    maxWeight: z.number().int(),
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

    const { handleSubmit } = formState;
    const onSubmit = handleSubmit((data) => {
        console.log("onSubmit", data);

        const newCanva: GraphCanva = {
            title: data.title,
            id: Math.random().toString().slice(0, 10).toString(),
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

        console.log(newCanva);
        addNewCanvas(newCanva);
        setCurrent(newCanva.id);
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
                                                <SelectItem value="mst">
                                                    Minimum Spanning Tree
                                                </SelectItem>
                                                <SelectItem value="maxfow">
                                                    Maximum Flow
                                                </SelectItem>
                                                <SelectItem value="astar">
                                                    A Star
                                                </SelectItem>
                                                <SelectItem value="bellman">
                                                    Bellman Ford Graph
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
                                                min={2}
                                                max={50}
                                                {...field}
                                            />
                                        </FormControl>
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
