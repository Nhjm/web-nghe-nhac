import ProfileTrack from "@/components/track/profile.track";
import { sendRequest } from "@/utils/api";
import { Container, Grid } from "@mui/material";

const ProfilePage = async ({ params }: { params: { slug: string } }) => {
	const res = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
		url: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/tracks/users?current=1&pageSize=10`,
		method: "POST",
		body: { id: params.slug },
	});
	const data = res?.data?.result || [];

	return (
		<Container sx={{ my: 4 }}>
			<Grid container spacing={6}>
				{data.map((item) => (
					<Grid item key={item._id} md={4} xs={12}>
						<ProfileTrack data={item} />
					</Grid>
				))}
			</Grid>
		</Container>
	);
};

export default ProfilePage;
