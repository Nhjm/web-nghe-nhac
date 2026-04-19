import { useState, useEffect } from 'react';
import WaveSurfer, { WaveSurferOptions } from "wavesurfer.js";

export const useHasMounted = () => {
    const [hasMounted, setHasMounted] = useState<boolean>(false);
    useEffect(() => {
        setHasMounted(true);
    }, []);

    return hasMounted;
}

export const useWavesurfer = (
    containerRef: React.RefObject<HTMLDivElement>,
    options: Omit<WaveSurferOptions, "container">,
) => {
    const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        console.log("da ve");
        

        const ws = WaveSurfer.create({
            ...options,
            container: containerRef.current,

            renderFunction: (channels, ctx) => {
                const { width, height } = ctx.canvas

                const barWidth = options.barWidth ?? 2
                const barGap = options.barGap ?? 1

                const barCount = Math.floor(width / (barWidth + barGap))
                const step = Math.max(1, Math.floor(channels[0].length / barCount))

                const topPartHeight = height * 0.7
                const bottomPartHeight = height * 0.3

                ctx.clearRect(0, 0, width, height)
                ctx.beginPath()

                for (let i = 0; i < barCount; i++) {
                    let sumTop = 0
                    let sumBottom = 0

                    // 1️⃣ TÍNH AVERAGE ĐÚNG
                    for (let j = 0; j < step; j++) {
                        const index = i * step + j
                        sumTop += Math.abs(channels[0][index] || 0)
                        sumBottom += Math.abs(channels[1]?.[index] || 0)
                    }

                    const avgTop = sumTop / step
                    const avgBottom = sumBottom / step

                    // 2️⃣ BIÊN ĐỘ BAR (CLAMP)
                    const barValue = Math.min(1, (avgTop + avgBottom) * 1.2)

                    const x = i * (barWidth + barGap)

                    let topHeight = barValue * topPartHeight
                    let bottomHeight = barValue * bottomPartHeight

                    let yTop = topPartHeight - topHeight
                    let yBottom = topPartHeight

                    // 3️⃣ BAR ALIGN
                    if (options.barAlign === "top") {
                        yTop = 0
                        yBottom = topPartHeight
                    } else if (options.barAlign === "bottom") {
                        yTop = height - topPartHeight
                        yBottom = height - bottomHeight
                    }

                    // 4️⃣ VẼ BAR TRÊN
                    ctx.rect(x, yTop, barWidth, topHeight)

                    // 5️⃣ VẼ BAR DƯỚI (SỬA LỖI THIẾU PARAM)
                    ctx.rect(x, yBottom, barWidth, bottomHeight)
                }

                ctx.fill()
            }
        });

        setWavesurfer(ws);

        return () => {
            ws.destroy();
        };
    }, [options, containerRef]);

    return wavesurfer;
};