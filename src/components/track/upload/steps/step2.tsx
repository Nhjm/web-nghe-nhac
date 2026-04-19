import { Button, MenuItem, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import LinearProgress, {
	LinearProgressProps,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { sendRequest } from "@/utils/api";
import { SnackbarProvider, closeSnackbar, enqueueSnackbar } from "notistack";
import Image from "next/image";

const currencies = [
	{
		value: "CHILL",
		label: "CHILL",
	},
	{
		value: "WORKOUT",
		label: "WORKOUT",
	},
	{
		value: "PARTY",
		label: "PARTY",
	},
];

const VisuallyHiddenInput = styled("input")({
	clip: "rect(0 0 0 0)",
	clipPath: "inset(50%)",
	height: 1,
	overflow: "hidden",
	position: "absolute",
	bottom: 0,
	left: 0,
	whiteSpace: "nowrap",
	width: 1,
});

function InputFileUpload(props: any) {
	const { data: session } = useSession();
	const { newTrack, setNewTrack, setPreview } = props;

	const handleUpload = async (file: File) => {
		const url = URL.createObjectURL(file);
		setPreview(url);

		const formData = new FormData();
		formData.append("fileUpload", file);

		try {
			const res = await axios.post(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/files/upload`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${session?.access_token}`,
						target_type: "images",
					},
				},
			);

			setNewTrack({ ...newTrack, imgUrl: res.data.data.fileName });
		} catch (error) {
			//@ts-ignore
			alert(error?.response?.data?.message || "Upload failed");
		}
	};
	return (
		<Button
			component="label"
			role={undefined}
			variant="contained"
			tabIndex={-1}
			startIcon={<CloudUploadIcon />}
			onChange={(e) => {
				const event = e.target as HTMLInputElement;
				if (event.files && event.files.length > 0) {
					handleUpload(event.files[0]);
				}
			}}
		>
			Upload file
			<VisuallyHiddenInput type="file" />
		</Button>
	);
}

function LinearProgressWithLabel(
	props: LinearProgressProps & { value: number },
) {
	return (
		<Box sx={{ display: "flex", alignItems: "center" }}>
			<Box sx={{ width: "100%", mr: 1 }}>
				<LinearProgress variant="determinate" {...props} />
			</Box>
			<Box sx={{ minWidth: 35 }}>
				<Typography variant="body2" color="text.secondary">{`${Math.round(
					props.value,
				)}%`}</Typography>
			</Box>
		</Box>
	);
}

interface IProps {
	progress: number;
	TrackUPloadProps: TrackUPloadProps;
}

interface TrackUPloadProps {
	fileName: string;
	percent: number;
	uploadedTrackName: string;
}

interface INewTrack {
	title: string;
	description: string;
	category: string;
	trackUrl: string;
	imgUrl: string;
}

const Step2 = (props: IProps) => {
	const { data: session } = useSession();
	const [preview, setPreview] = useState<string | null>(null);
	const [newTrack, setNewTrack] = useState<INewTrack>({
		title: "",
		description: "",
		category: "",
		trackUrl: "",
		imgUrl: "",
	});

	useEffect(() => {
		if (props.TrackUPloadProps.uploadedTrackName) {
			setNewTrack((prev) => ({
				...prev,
				trackUrl: props.TrackUPloadProps.uploadedTrackName,
			}));
		}
	}, [props.TrackUPloadProps.uploadedTrackName]);

	const handleSubmit = async () => {
		const res = await sendRequest<IBackendRes<ITrackTop[]>>({
			url: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/tracks`,
			method: "POST",
			body: {
				title: newTrack.title,
				description: newTrack.description,
				category: newTrack.category,
				trackUrl: newTrack.trackUrl,
				imgUrl: newTrack.imgUrl,
			},
			headers: {
				Authorization: `Bearer ${session?.access_token}`,
			},
		});

		if (res.data) {
			enqueueSnackbar("Track created successfully!", {
				variant: "success",
				anchorOrigin: {
					vertical: "top",
					horizontal: "right",
				},
				action: (key) => (
					<Button
						onClick={() => closeSnackbar(key)}
						color="inherit"
						size="small"
					>
						Close
					</Button>
				),
			});
		} else {
			enqueueSnackbar(JSON.stringify(res.message), {
				variant: "error",
				anchorOrigin: {
					vertical: "top",
					horizontal: "right",
				},
				action: (key) => (
					<Button
						onClick={() => closeSnackbar(key)}
						color="inherit"
						size="small"
					>
						Close
					</Button>
				),
			});
		}
	};

	return (
		<Box>
			<Box sx={{ mb: 5 }}>
				<p>Uploading {props.TrackUPloadProps.fileName}</p>
				<LinearProgressWithLabel value={props.progress} />
			</Box>
			<Grid container spacing={0}>
				<Grid
					item
					md={4}
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						flexDirection: "column",
						gap: 2,
					}}
				>
					<div
						style={{ backgroundColor: "red", width: "250px", height: "250px" }}
					>
						{preview && (
							// <img
							//     src={preview}
							//     style={{
							//         width: 250,
							//         height: 250,
							//         objectFit: "cover",
							//     }}
							// />
							<Image
								src={preview}
								width={700}
								height={700}
								style={{
									width: "100%",
									height: "auto",
									objectFit: "cover",
								}}
								alt="tieu de anh"
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 20vw, 33vw"
							/>
						)}
					</div>
					<InputFileUpload
						setPreview={setPreview}
						newTrack={newTrack}
						setNewTrack={setNewTrack}
					/>
				</Grid>
				<Grid item md={8}>
					<TextField
						margin="dense"
						fullWidth
						label="Title"
						variant="standard"
						value={newTrack.title}
						onChange={(e) =>
							setNewTrack({ ...newTrack, title: e.target.value })
						}
					/>
					<TextField
						margin="dense"
						fullWidth
						label="Description"
						variant="standard"
						value={newTrack.description}
						onChange={(e) =>
							setNewTrack({ ...newTrack, description: e.target.value })
						}
					/>
					<TextField
						margin="dense"
						fullWidth
						select
						label="Category"
						variant="standard"
						value={newTrack.category}
						onChange={(e) =>
							setNewTrack({ ...newTrack, category: e.target.value })
						}
					>
						{currencies.map((option) => (
							<MenuItem key={option.value} value={option.value}>
								{option.label}
							</MenuItem>
						))}
					</TextField>
					<Button onClick={handleSubmit} sx={{ mt: 5 }} variant="outlined">
						Save
					</Button>
				</Grid>
			</Grid>
		</Box>
	);
};

export default Step2;
