import { Circle, Group, Text } from "react-konva";
import { CanvaGraphNode } from "../Canva";
import { KonvaEventObject } from "konva/lib/Node";
import { useTheme } from "../theme-provider";
import { NodeRadius } from "./constants";

export default function Node({
    nodes,
    handleCircleDrag,
}: {
    nodes: CanvaGraphNode[];
    handleCircleDrag: (
        e: KonvaEventObject<MouseEvent>,
        circle: CanvaGraphNode
    ) => void;
}) {
    const {theme} = useTheme()
    
    const nodeColor = theme === "dark" ? "#D3D3D3" : "#000000"
    const textColor = theme === "dark" ? "#000000" : "#FFFFFF"
    return (
        <>
            {nodes.map((node) => {
                const { x, y, title } = node;
                return (
                    <Group key={title}>
                        <Circle
                            x={x}
                            y={y}
                            radius={NodeRadius}
                            fill={nodeColor}
                            draggable
                            onDragMove={(e) => handleCircleDrag(e, node)}
                        />
                        <Text
                            x={x - NodeRadius} // Ajusta la posición horizontal
                            y={y - NodeRadius} // Ajusta la posición vertical
                            text={title}
                            fontSize={NodeRadius} // Tamaño de fuente proporcional al radio
                            fill={textColor} // Color del texto
                            align="center"
                            verticalAlign="middle"
                            width={NodeRadius * 2}
                            height={NodeRadius * 2}
                            listening={false}
                        />
                    </Group>
                );
            })}
        </>
    );
}
