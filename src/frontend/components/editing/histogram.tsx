import { useWorkSession } from "@/providers/sessionprovider";
import { useSessionStore } from "@/stores/sessionData";
import { useRef } from "react";

export default function Histogram() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const { selectedImg, imgs } = useWorkSession();
    const { convertHistogram } = useSessionStore();

    const histogramData = convertHistogram(canvasRef, imgs[selectedImg]);

    if (!(histogramData instanceof Array)) return;

    const width = 256;
    const height = 100;

    const max = Math.max(...histogramData) || 1;

    let path = `M 0 ${height}`;

    histogramData.forEach((v, i) => {
        const y = height - (v / max) * height;
        path += ` L ${i} ${y}`;
    })

    path += ` L ${width} ${height} Z`;

    return (
        <svg width={width} height={height}>
            <path d={path} fill="white" opacity={0.8} />
        </svg>
    )
}