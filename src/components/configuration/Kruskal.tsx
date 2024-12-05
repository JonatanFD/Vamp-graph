import { StepBack, StepForward } from "lucide-react";
import { Label } from "../ui/label";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { useGraphSolution } from "@/hooks/use-graph-solution";
import { Button } from "../ui/button";

export default function Kruskal() {
    const { solution, step, setStep } = useGraphSolution();

    const handleNextStep = () => {
        console.log(solution);
        if (step === solution.solution.tree.length - 1) return;
        setStep(step + 1);
    };

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

            <SidebarMenuItem>
                <SidebarMenuButton asChild>Show Table</SidebarMenuButton>
            </SidebarMenuItem>
        </>
    );
}
