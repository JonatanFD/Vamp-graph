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
} from "./ui/sidebar";
import { CreateNewCanva } from "./CreateNewCanva";
import { useVampGraph } from "@/hooks/use-vamp-graph";
import { ModeToggle } from "./theme-toggle";

export default function SideBar() {
    const { canvas, setCurrent, current } = useVampGraph();
    return (
        <Sidebar>
            <SidebarHeader>
                <section className="flex items-center gap-4 flex-row p-2">
                    <Waypoints />
                    <h1>Vamp Graph</h1>
                </section>
            </SidebarHeader>

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
                                        <SidebarMenuButton asChild isActive={item.id === current}>
                                            <span>{item.title}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel className="flex items-center justify-between">
                        <span>Configuration</span>
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="max-h-[300px]">
                            
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="flex items-end">
                <ModeToggle />
            </SidebarFooter>
        </Sidebar>
    );
}
