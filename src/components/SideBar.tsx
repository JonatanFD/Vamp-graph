import { Waypoints } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from "./ui/sidebar";
import { CreateNewCanva } from "./CreateNewCanva";
import { useVampGraph } from "@/hooks/use-vamp-graph";
import { ModeToggle } from "./theme-toggle";
import { useGraphSolution } from "@/hooks/use-graph-solution";
import Kruskal from "./configuration/Kruskal";
import Prim from "./configuration/Prim";
import FordFulkerson from "./configuration/FordFulkerson";
import SolutionPicker from "./canva-elements/SolutionPicker";

export default function SideBar() {
    const { canvas, setCurrent, current } = useVampGraph();
    const { solution } = useGraphSolution();
    return (
        <Sidebar>
            <SidebarHeader>
                <section className="flex items-center gap-4 flex-row p-2">
                    <Waypoints />
                    <h1>Vamp Graph</h1>
                </section>
            </SidebarHeader>
            <SidebarSeparator />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="flex items-center justify-between">
                        <span>Canvas</span>
                        <CreateNewCanva />
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="max-h-[300px]">
                            {canvas.map((item) => {
                                return (
                                    <SidebarMenuItem
                                        key={item.id}
                                        onClick={() => setCurrent(item.id)}
                                    >
                                        <SidebarMenuButton
                                            asChild
                                            isActive={item.id === current}
                                        >
                                            <span>{item.title}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarSeparator />

                <SolutionPicker />
                
                <SidebarGroup>
                    <SidebarGroupLabel className="flex items-center justify-between">
                        <span>Configuration</span>
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="max-h-[300px]">
                            {solution.algorithm === "" && (
                                <div className="flex flex-col gap-2">
                                    <h2>Create a new Canva</h2>
                                </div>
                            )}

                            {solution.algorithm === "kruskal" && <Kruskal />}
                            {solution.algorithm === "prim" && <Prim />}
                            {solution.algorithm === "maxflow" && <FordFulkerson />}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarSeparator />

            <SidebarFooter className="flex items-end">
                <ModeToggle />
            </SidebarFooter>
        </Sidebar>
    );
}
