"use client";
import { useWavesurfer } from "@/utils/customHook";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { WaveSurferOptions } from "wavesurfer.js";
import "./wave.scss";
import { Grid, Tooltip } from "@mui/material";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import { useTrackContext } from "@/lib/track.wrapper";
import { fetchDefaultImage, sendRequest } from "@/utils/api";
import CommentTrack from "@/components/track/comment.track";
import LikeTrack from "@/components/track/like.track";
import Image from "next/image";

interface IProps {
	track: ITrackTop | null;
	comments: ITrackComment[];
	likes: ITrackLike[] | null;
}

const WaveTrack = (props: IProps) => {
	const { track, comments, likes } = props;
	const router = useRouter();
	const firstViewRef = useRef(true);
	const containerRef = useRef<HTMLDivElement>(null);
	const [time, setTime] = useState<string>("0:00");
	const [duration, setduration] = useState<string>("0:00");
	const hoverRef = useRef<HTMLDivElement>(null);
	const searchParams = useSearchParams();
	const fileName = searchParams.get("audio");
	const { currentTrack, setCurrentTrack } = useTrackContext();
	const optionsMemo = useMemo((): Omit<WaveSurferOptions, "container"> => {
		let linGrad, wlinGrad;

		if (typeof window !== "undefined") {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d")!;

			linGrad = ctx.createLinearGradient(0, 0, 0, 140);
			linGrad.addColorStop(0.7, "#ffffff");
			// linGrad.addColorStop(0.7, 'rgba(183, 183, 183, 1.000)')

			wlinGrad = ctx.createLinearGradient(0, 0, 0, 140);
			wlinGrad.addColorStop(0.7, "#f14c07");
			// wlinGrad.addColorStop(0.7, 'rgba(255,192,160, 1.000)')
		}

		return {
			barWidth: 3,
			barRadius: 20,
			url: `/api?audio=${fileName}`,
			height: 100,
			cursorColor: "transparent",
			progressColor: wlinGrad,
			waveColor: linGrad,
		};
	}, []);
	const wavesurfer = useWavesurfer(containerRef, optionsMemo);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);

	useEffect(() => {
		if (!wavesurfer) return;
		setIsPlaying(false);
		const hover = hoverRef.current!;
		const waveform = containerRef.current!;
		waveform.addEventListener(
			"pointermove",
			(e) => (hover.style.width = `${e.offsetX}px`),
		);

		const subcriptions = [
			wavesurfer.on("play", () => setIsPlaying(true)),
			wavesurfer.on("pause", () => setIsPlaying(false)),
			wavesurfer.on("decode", (duration) => {
				setduration(formatTime(duration));
			}),
			wavesurfer.on("timeupdate", (currentTime) => {
				setTime(formatTime(currentTime));
			}),
			wavesurfer.on("interaction", () => {
				wavesurfer.play();
			}),
		];

		return () => {
			subcriptions.forEach((unsub) => unsub());
		};
	}, [wavesurfer]);

	const onPlayPause = useCallback(() => {
		wavesurfer && wavesurfer.playPause();
	}, [wavesurfer]);

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const secondsRemainder = Math.round(seconds) % 60;
		const paddedSeconds = `0${secondsRemainder}`.slice(-2);
		return `${minutes}:${paddedSeconds}`;
	};

	const calLeft = (moment: number) => {
		const percent = (moment / (wavesurfer?.getDuration() ?? 0)) * 100;

		return `${percent}%`;
	};

	useEffect(() => {
		if (track?._id === currentTrack?._id && wavesurfer) {
			currentTrack.isPlaying ? wavesurfer.play() : wavesurfer.pause();
		}
	}, [currentTrack]);

	const handleIncreaseView = async () => {
		if (!firstViewRef.current) return;

		await sendRequest<IBackendRes<ITrackTop>>({
			url: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/tracks/increase-view`,
			method: "POST",
			body: {
				trackId: track?._id,
			},
		});

		router.refresh();
		firstViewRef.current = false;
	};

	return (
		<>
			<div
				style={{
					background:
						"radial-gradient(circle at 30% 70%, #6a3a6e 0%, #472548 40%, #1a0e1b 100%)",
					height: "384px",
					width: "100%",
					padding: "32px",
				}}
			>
				<Grid container style={{ height: "100%", width: "100%" }}>
					<Grid
						item
						xs={8}
						style={{ position: "relative", width: "100%", height: "100%" }}
					>
						<div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
							<div
								onClick={() => {
									onPlayPause();
									handleIncreaseView();
									if (!currentTrack || !track) return;
									setCurrentTrack({ ...track, isPlaying: !isPlaying });
								}}
								style={{
									height: "50px",
									width: "50px",
									borderRadius: "50%",
									backgroundColor: "rgb(255, 255, 255)",
									cursor: "pointer",
								}}
							>
								{isPlaying ? (
									<PauseCircleIcon style={{ height: "100%", width: "100%" }} />
								) : (
									<PlayCircleFilledWhiteIcon
										style={{ height: "100%", width: "100%" }}
									/>
								)}
							</div>
							<h2 style={{ color: "white" }}>{track?.title}</h2>
						</div>
						<div
							style={{
								width: "calc(100% - 32px)",
								position: "absolute",
								bottom: "0px",
								left: "0px",
							}}
							ref={containerRef}
							className="waveform"
						>
							<div className="time">{time}</div>
							<div className="duration">{duration}</div>
							<div className="hover-wave" ref={hoverRef}></div>
						</div>
						<div
							style={{
								position: "absolute",
								backgroundColor: "rgba(0, 0, 0, 0.4)",
								bottom: "0px",
								width: "calc(100% - 32px)",
								height: "30px",
								zIndex: "10",
							}}
						>
							<div className="comments" style={{ position: "relative" }}>
								{comments.map((comment) => {
									return (
										<Tooltip key={comment._id} title={comment.content} arrow>
											<Image
												src={fetchDefaultImage(comment.user.type)}
												width={20}
												height={20}
												alt={comment.content}
												style={{
													objectFit: "contain",
													position: "absolute",
													top: 0,
													left: calLeft(comment.moment),
													zIndex: 30,
												}}
												sizes="(max-width: 768px) 100vw, (max-width: 1200px) 20vw, 33vw"
											/>
										</Tooltip>
									);
								})}
							</div>
						</div>
					</Grid>
					<Grid item xs={4} sx={{ width: "100%", height: "100%" }}>
						<div
							style={{
								backgroundColor: "black",
								overflow: "hidden",
								width: "100%",
								height: "100%",
								position: "relative",
							}}
						>
							{/* <img
								src={`${process.env.NEXT_PUBLIC_BACKEND_URL}images/${track?.imgUrl}`}
								alt=""
								style={{ width: "100%", objectFit: "contain" }}
							/> */}
							<Image
								src={`${process.env.NEXT_PUBLIC_BACKEND_URL}images/${track?.imgUrl}`}
								alt="tieu de anh"
								width={700}
								height={700}
								style={{
									width: "100%",
									height: "auto",
									objectFit: "cover",
								}}
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 20vw, 33vw"
							/>
						</div>
					</Grid>
				</Grid>
			</div>
			<LikeTrack track={track} likes={likes} />
			<CommentTrack comments={comments} track={track} wavesurfer={wavesurfer} />
		</>
	);
};

export default WaveTrack;
