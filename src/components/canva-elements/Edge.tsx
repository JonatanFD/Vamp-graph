import { Arrow, Group, Line, Text } from "react-konva";
import { CanvaGraphNode, GraphLine } from "../Canva";
import { useTheme } from "../theme-provider";
import { NodeRadius } from "./constants";

function getConnectorPoints(from: CanvaGraphNode, to: CanvaGraphNode) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const angle = Math.atan2(-dy, dx);

    return [
        from.x + -NodeRadius * Math.cos(angle + Math.PI),
        from.y + NodeRadius * Math.sin(angle + Math.PI),
        to.x + -NodeRadius * Math.cos(angle),
        to.y + NodeRadius * Math.sin(angle),
    ];
}

export default function Edge({ edges }: { edges: GraphLine[] }) {
    const { theme } = useTheme();
    const color = theme === "dark" ? "#D3D3D3" : "#D3D3D3";
    const weightColor = theme === "dark" ? "#ffffff" : "#000000";

    return (
        <>
            {edges.map((edge) => {
                const points = getConnectorPoints(edge.from, edge.to);
                const id = edge.from.title + edge.to.title;

                const weightWidth = Math.abs(points[2] - points[0]);
                const weightHeight = Math.abs(points[3] - points[1]);

                return (
                    <Group key={edge.from.title + edge.to.title}>
                        {edge.type === "directed" && (
                            <Arrow
                                points={points}
                                strokeWidth={1}
                                stroke={color}
                                fill={color}
                                id={id}
                                lineCap="round"
                            />
                        )}

                        {edge.type === "undirected" && (
                            <Line
                                points={points}
                                strokeWidth={1}
                                stroke={color}
                                id={id}
                            />
                        )}

                        <Group>
                            <Text
                                x={
                                    points[0] < points[2]
                                        ? points[0]
                                        : points[2]
                                } // Ajusta la posición horizontal
                                y={
                                    points[1] < points[3]
                                        ? points[1]
                                        : points[3]
                                } // Ajusta la posición vertical
                                text={edge.weight.toString()}
                                fontSize={12} // Tamaño de fuente proporcional al radio
                                fill={weightColor} // Color del texto
                                align="center"
                                verticalAlign="middle"
                                width={weightWidth}
                                height={weightHeight}
                            />
                        </Group>
                    </Group>
                );
            })}
        </>
    );
}
