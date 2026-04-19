import Chip from "@mui/material/Chip";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface IProps {
	track: ITrackTop | null;
	likes: ITrackLike[] | null;
}

const LikeTrack = (props: IProps) => {
	const { track, likes } = props;
	const router = useRouter();
	const { data: session } = useSession();

	const handleClick = async () => {
		if (!session) {
			router.push("/login");
			return;
		}

		await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
			url: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/likes`,
			method: "POST",
			body: {
				track: track?._id,
				quantity: likes?.some((like) => like._id === track?._id) ? -1 : 1,
			},
			headers: {
				authorization: `Bearer ${session?.access_token}`,
			},
		});

		router.refresh();
	};

	return (
		<div style={{ display: "flex", justifyContent: "space-between" }}>
			<Chip
				icon={<FavoriteIcon />}
				label="Like"
				color={
					likes?.some((like) => like._id === track?._id) ? "error" : "default"
				}
				onClick={handleClick}
			/>
			<div style={{ display: "flex" }}>
				<Chip icon={<PlayArrowIcon />} label={track?.countPlay} />
				<Chip icon={<FavoriteIcon />} label={track?.countLike} />
			</div>
		</div>
	);
};

export default LikeTrack;
