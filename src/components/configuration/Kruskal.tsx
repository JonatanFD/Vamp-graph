import { StepBack, StepForward } from "lucide-react";
import { Label } from "../ui/label";
import { SidebarMenuItem } from "../ui/sidebar";
import { useGraphSolution } from "@/hooks/use-graph-solution";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogDescription,
    DialogTrigger,
} from "@radix-ui/react-dialog";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { MSTSolution } from "@/lib/types";

export default function Kruskal() {
    const { solution, step, setStep } = useGraphSolution();
    const sol = solution.solution as MSTSolution;

    const handleNextStep = () => {
        if (step === sol.tree.length - 1) return;
        setStep(step + 1);
    };

    const totalWeight = sol.tree.reduce((acc, item) => {
        return acc + item[2];
    }, 0);

    const handlePrevStep = () => {
        if (step === -1) return;
        setStep(step - 1);
    };

    return (
        <>
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

            <SidebarMenuItem className="px-2">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            size="sm"
                            variant="outline"
                            className="w-full mt-"
                        >
                            Show Table
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Solution</DialogTitle>
                            <DialogDescription>
                                You can see all steps here
                            </DialogDescription>
                        </DialogHeader>
                        <Table>
                            <TableCaption>Solution Tree</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-center">
                                        Index
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Edge
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Weight
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sol.tree.map((item, index) => {
                                    return (
                                        <TableRow key={index}>
                                            <TableCell className="text-center">
                                                {index}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {item[0]} -{item[1]}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {item[2]}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                <TableRow>
                                    <TableCell className="text-center"></TableCell>
                                    <TableCell className="text-center"></TableCell>
                                    <TableCell className="text-center">
                                        {totalWeight}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </DialogContent>
                </Dialog>
            </SidebarMenuItem>
        </>
    );
}
