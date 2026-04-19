"use client";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { useTheme } from "@mui/material/styles";
import { useTrackContext } from "@/lib/track.wrapper";
import PauseIcon from "@mui/icons-material/Pause";
import Link from "next/link";
import { convertTextToSlug } from "@/utils/api";

const ProfileTrack = (props: { data: ITrackTop }) => {
	const { data } = props;
	const theme = useTheme();

	const { currentTrack, setCurrentTrack } = useTrackContext();

	return (
		<Card sx={{ display: "flex", mx: "auto", justifyContent: "space-between" }}>
			<Box sx={{ display: "flex", flexDirection: "column" }}>
				<CardContent sx={{ flex: "1 0 auto" }}>
					<Link
						href={`/track/${convertTextToSlug(data.title)}-${data._id}.html?audio=${data.trackUrl}`}
					>
						<h3>{data.title}</h3>
					</Link>
					<Typography
						variant="subtitle1"
						component="div"
						sx={{ color: "text.secondary" }}
					>
						{data?.category}
					</Typography>
				</CardContent>
				<Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
					<IconButton aria-label="previous">
						{theme.direction === "rtl" ? (
							<SkipNextIcon />
						) : (
							<SkipPreviousIcon />
						)}
					</IconButton>
					{data._id === currentTrack._id && currentTrack.isPlaying === true && (
						<IconButton
							aria-label="play/pause"
							onClick={() => {
								setCurrentTrack({ ...data, isPlaying: false });
							}}
						>
							<PauseIcon sx={{ height: 38, width: 38 }} />
						</IconButton>
					)}
					{(data._id !== currentTrack._id ||
						(currentTrack.isPlaying === false &&
							data._id === currentTrack._id)) && (
						<IconButton
							aria-label="play/pause"
							onClick={() => {
								setCurrentTrack({ ...data, isPlaying: true });
							}}
						>
							<PlayArrowIcon sx={{ height: 38, width: 38 }} />
						</IconButton>
					)}
					<IconButton aria-label="next">
						{theme.direction === "rtl" ? (
							<SkipPreviousIcon />
						) : (
							<SkipNextIcon />
						)}
					</IconButton>
				</Box>
			</Box>
			<CardMedia
				component="img"
				sx={{ width: 151 }}
				image={process.env.NEXT_PUBLIC_BACKEND_URL + "/images/" + data?.imgUrl}
				alt="Live from space album cover"
			/>
		</Card>
	);
};

export default ProfileTrack;
