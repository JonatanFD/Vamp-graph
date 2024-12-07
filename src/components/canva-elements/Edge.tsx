import { Arrow, Group, Line, Rect, Text } from "react-konva";
import { CanvaGraphNode, GraphLine } from "../Canva";
import { useTheme } from "../theme-provider";
import { NodeRadius } from "./constants";
import { useEffect, useRef } from "react";
import Konva from "konva";

function getConnectorPoints(from: CanvaGraphNode, to: CanvaGraphNode) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const angle = Math.atan2(-dy, dx);
    const radio = NodeRadius + 4;
    return [
        from.x + -radio * Math.cos(angle + Math.PI),
        from.y + radio * Math.sin(angle + Math.PI),
        to.x + -radio * Math.cos(angle),
        to.y + radio * Math.sin(angle),
    ];
}

function EdgeWeight({
    edge,
    points,
    weightWidth,
    weightHeight,
    weightColor,
}: {
    edge: GraphLine;
    points: number[];
    weightWidth: number;
    weightHeight: number;
    weightColor: string;
}) {
    const {theme} = useTheme()
    const weightRef = useRef<Konva.Text>(null);
    const rectRef = useRef<Konva.Rect>(null);

    const rectColor = theme === "dark" ? "black" : "white";

    useEffect(() => {
        if (!weightRef.current) return;
        if (!rectRef.current) return;

        const computedLabel = new Konva.Text({
            text: edge.weight.toString(),
            fontSize: 12,
            fill: weightColor,
        });
        const width = computedLabel.getWidth();
        const height = computedLabel.getHeight();

        const xcentered = (points[2] + points[0]) / 2;
        const ycentered = (points[3] + points[1]) / 2;

        rectRef.current.setAttrs({
            x: xcentered - width / 2 - 4,
            y: ycentered - height / 2 - 2,
            width: width + 8,
            height: height + 4,
        });
    }, [edge]);

    return (
        <>
            <Rect fill={rectColor} ref={rectRef} cornerRadius={1}/>
            <Text
                x={(points[0] < points[2] ? points[0] : points[2]) - NodeRadius}
                y={(points[1] < points[3] ? points[1] : points[3]) - NodeRadius}
                text={edge.weight.toString()}
                fontSize={12}
                fill={weightColor}
                align="center"
                verticalAlign="middle"
                width={weightWidth + NodeRadius * 2}
                height={weightHeight + NodeRadius * 2}
                ref={weightRef}
            />
        </>
    );
}

export default function Edge({ edges }: { edges: GraphLine[] }) {
    const { theme } = useTheme();
    const color = theme === "dark" ? "#D3D3D3" : "#D3D3D3";
    const weightColor = theme === "dark" ? "#ffffff" : "#000000";

    const strokeWidth = 2;
    return (
        <>
            {edges.map((edge) => {
                const points = getConnectorPoints(edge.from, edge.to);
                const id = edge.from.title + edge.to.title;

                const weightWidth = Math.abs(points[2] - points[0]);
                const weightHeight = Math.abs(points[3] - points[1]);

                const edgeColor = edge.selected ? "#0C59DF" : color;
                return (
                    <Group key={edge.from.title + edge.to.title} >
                        {edge.type === "directed" && (
                            <Arrow
                                points={points}
                                strokeWidth={strokeWidth}
                                stroke={edgeColor}
                                fill={edgeColor}
                                id={id}
                                lineCap="round"
                            />
                        )}

                        {edge.type === "undirected" && (
                            <Line
                                points={points}
                                strokeWidth={strokeWidth}
                                stroke={edgeColor}
                                id={id}
                            />
                        )}

                        <EdgeWeight
                            edge={edge}
                            points={points}
                            weightWidth={weightWidth}
                            weightHeight={weightHeight}
                            weightColor={weightColor}
                        />
                    </Group>
                );
            })}
        </>
    );
}
