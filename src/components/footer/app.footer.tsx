"use client";
import { useTrackContext } from "@/lib/track.wrapper";
import { useHasMounted } from "@/utils/customHook";
import { AppBar, Container } from "@mui/material";
import { useEffect, useRef } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

const AppFooter = () => {
	const hasMounted = useHasMounted();
	const TrackFooterRef = useRef<AudioPlayer | null>(null);
	const { currentTrack, setCurrentTrack } = useTrackContext();

	useEffect(() => {
		if (currentTrack?.isPlaying === false) {
			TrackFooterRef?.current?.audio?.current?.pause();
		} else {
			TrackFooterRef?.current?.audio?.current?.play();
		}
	}, [currentTrack]);
	if (!hasMounted) return <></>;

	return (
		<>
			{currentTrack?._id && (
				<AppBar
					position="fixed"
					sx={{ top: "auto", bottom: 0, background: "#cbcbcb" }}
				>
					<Container sx={{ display: "flex", gap: 10 }}>
						<AudioPlayer
							ref={TrackFooterRef}
							layout="horizontal-reverse"
							style={{ background: "#cbcbcb", boxShadow: "none" }}
							src={`${process.env.NEXT_PUBLIC_BACKEND_URL}tracks/${currentTrack.trackUrl}`}
							onPlay={(e) =>
								setCurrentTrack({ ...currentTrack, isPlaying: true })
							}
							onPause={(e) =>
								setCurrentTrack({ ...currentTrack, isPlaying: false })
							}
						/>
						<div style={{ color: "black" }}>{currentTrack.title}</div>
					</Container>
				</AppBar>
			)}
		</>
	);
};

export default AppFooter;
