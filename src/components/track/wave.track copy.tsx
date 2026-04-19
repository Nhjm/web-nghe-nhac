"use client";
import { useWavesurfer } from "@/utils/customHook";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { WaveSurferOptions } from "wavesurfer.js";
import "./wave.scss"

const WaveTrack = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [time, setTime] = useState<string>("0:00");
    const [duration, setduration] = useState<string>("0:00");
    const hoverRef = useRef<HTMLDivElement>(null);
    const searchParams = useSearchParams();
    const fileName = searchParams.get("audio");
    const optionsMemo = useMemo((): Omit<WaveSurferOptions, "container"> => {
        let linGrad, wlinGrad;
        let gradient, progressGradient

        if (typeof window !== "undefined") {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d")!;

            // Define the waveform gradient
            gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
            gradient.addColorStop(0, "#656666"); // Top color
            gradient.addColorStop((canvas.height * 0.7) / canvas.height, "#656666"); // Top color
            gradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, "#ffffff"); // White line
            gradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, "#ffffff"); // White line
            gradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, "#B1B1B1"); // Bottom color
            gradient.addColorStop(1, "#B1B1B1"); // Bottom color

            // Define the progress gradient
            progressGradient = ctx.createLinearGradient(
                0,
                0,
                0,
                canvas.height * 1.35,
            );
            progressGradient.addColorStop(0, "#EE772F"); // Top color
            progressGradient.addColorStop(
                (canvas.height * 0.7) / canvas.height,
                "#EB4926",
            ); // Top color
            progressGradient.addColorStop(
                (canvas.height * 0.7 + 1) / canvas.height,
                "#ffffff",
            ); // White line
            progressGradient.addColorStop(
                (canvas.height * 0.7 + 2) / canvas.height,
                "#ffffff",
            ); // White line
            progressGradient.addColorStop(
                (canvas.height * 0.7 + 3) / canvas.height,
                "#F6B094",
            ); // Bottom color
            progressGradient.addColorStop(1, "#F6B094"); // Bottom color

            linGrad = ctx.createLinearGradient(0, 0, 0, 140)
            linGrad.addColorStop(0.5, 'rgba(116, 116, 116, 1.000)')
            linGrad.addColorStop(0.5, 'rgba(183, 183, 183, 1.000)')

            wlinGrad = ctx.createLinearGradient(0, 0, 0, 140)
            wlinGrad.addColorStop(0.5, 'rgba(255,98,50, 1.000)')
            wlinGrad.addColorStop(0.5, 'rgba(255,192,160, 1.000)')
        }

        return {
            barWidth: 2,
            barRadius: 20,
            url: `/api?audio=${fileName}`,
            height: 80,
            normalize: true,
            cursorColor: 'transparent',
            barGap: 2,
            cursorWidth: 3,
            progressColor: wlinGrad,
            waveColor: linGrad
        };
    }, []);
    const wavesurfer = useWavesurfer(containerRef, optionsMemo);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    useEffect(() => {
        if (!wavesurfer) return;
        setIsPlaying(false);
        const hover = hoverRef.current!
        const waveform = containerRef.current!
        waveform.addEventListener('pointermove', (e) => (hover.style.width = `${e.offsetX}px`))

        const subcriptions = [
            wavesurfer.on("play", () => setIsPlaying(true)),
            wavesurfer.on("pause", () => setIsPlaying(false)),
            wavesurfer.on('decode', (duration) => {
                setduration(formatTime(duration))
            }),
            wavesurfer.on('timeupdate', (currentTime) => {
                setTime(formatTime(currentTime))
            }),
            wavesurfer.on('interaction', () => {
                wavesurfer.play()
            })
        ];

        return () => {
            subcriptions.forEach((unsub) => unsub());
        };
    }, [wavesurfer]);

    const onPlayPause = useCallback(() => {
        wavesurfer && wavesurfer.playPause();
    }, [wavesurfer]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const secondsRemainder = Math.round(seconds) % 60
        const paddedSeconds = `0${secondsRemainder}`.slice(-2)
        return `${minutes}:${paddedSeconds}`
    }

    return (
        <div ref={containerRef} className="waveform">
            <button onClick={onPlayPause} style={{ minWidth: "5em" }}>
                {isPlaying ? "Pause" : "Play"}
            </button>
            <div className="time">{time}</div>
            <div className="duration">{duration}</div>
            <div className="hover-wave" ref={hoverRef}></div>
        </div>
    );
};

export default WaveTrack;
