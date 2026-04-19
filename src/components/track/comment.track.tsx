import { fetchDefaultImage, sendRequest } from "@/utils/api";
import { Grid, TextField } from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import WaveSurfer from "wavesurfer.js";
dayjs.extend(relativeTime);

const CommentTrack = ({
	comments,
	track,
	wavesurfer,
}: {
	comments: ITrackComment[];
	track: ITrackTop | null;
	wavesurfer: WaveSurfer | null;
}) => {
	const router = useRouter();
	const [commentContent, setCommentContent] = useState<string>("");
	const { data: session } = useSession();

	const handleAddComment = async () => {
		const res = await sendRequest<IBackendRes<ITrackComment>>({
			url: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/comments`,
			headers: {
				authorization: `Bearer ${session?.access_token}`,
			},
			method: "POST",
			body: {
				content: commentContent,
				track: track?._id!,
				moment: Math.round(wavesurfer?.getCurrentTime() ?? 0),
			},
		});

		if (res.data) {
			setCommentContent("");
			router.refresh();
		}
	};

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const secondsRemainder = Math.round(seconds) % 60;
		const paddedSeconds = `0${secondsRemainder}`.slice(-2);
		return `${minutes}:${paddedSeconds}`;
	};

	const handleJumpTrack = (moment: number) => {
		if (wavesurfer) {
			const duration = wavesurfer.getDuration();
			console.log(
				"🚀 ~ comment.track.tsx:54 ~ handleJumpTrack ~ wavesurfer.getDuration():",
				wavesurfer.getDuration(),
			);
			wavesurfer.seekTo(moment / duration);
			wavesurfer.play();
		}
	};

	return (
		<Grid container spacing={2} marginTop={10}>
			<TextField
				fullWidth
				label="Comment"
				variant="standard"
				value={commentContent}
				onChange={(e) => setCommentContent(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						handleAddComment();
					}
				}}
			/>
			<Grid item md={4}>
				<Image
					src={fetchDefaultImage(track?.uploader?.type!)}
					alt={track?.uploader?.email!}
					width={700}
					height={700}
					style={{
						width: "100%",
						height: "auto",
						borderRadius: "50%",
						objectFit: "cover",
					}}
				/>
				<div style={{ margin: "auto" }}>{track?.uploader?.email}</div>
			</Grid>
			<Grid item md={8}>
				<div>
					{comments.map((comment) => (
						<div
							key={comment._id}
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								marginTop: "16px",
							}}
						>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									gap: "8px",
									justifyContent: "space-between",
								}}
							>
								{/* <img
									style={{ height: 30, width: 30, borderRadius: "50%" }}
									src={fetchDefaultImage(comment.user.type)}
									alt={comment.content}
								/> */}
								<Image
									src={fetchDefaultImage(comment.user.type)}
									height={30}
									width={30}
									style={{ objectFit: "contain", borderRadius: "50%" }}
									alt={comment.content}
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 20vw, 33vw"
								/>
								<div>
									<div>{comment.user.email}</div>
									<div>
										{comment.content} at{" "}
										<span
											onClick={() => handleJumpTrack(comment.moment)}
											style={{ textDecoration: "underline", cursor: "pointer" }}
										>
											{formatTime(comment.moment)}
										</span>
									</div>
								</div>
							</div>
							<div>{dayjs(comment.createdAt).fromNow()}</div>
						</div>
					))}
				</div>
			</Grid>
		</Grid>
	);
};

export default CommentTrack;
