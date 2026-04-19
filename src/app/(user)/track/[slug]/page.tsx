import WaveTrack from "@/components/track/wave.track";
import { convertSlugToId, sendRequest } from "@/utils/api";
import { Container } from "@mui/material";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
	{ params, searchParams }: Props,
	parent: ResolvingMetadata,
): Promise<Metadata> {
	const slug = (await params).slug;

	const res = await sendRequest<IBackendRes<ITrackTop>>({
		url: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/tracks/${convertSlugToId(slug)}`,
		method: "GET",
	});

	return {
		title: res?.data?.title ?? "Track Detail",
		description: res?.data?.description ?? "Track description",
		openGraph: {
			title: res?.data?.title ?? "Track Detail",
			description: res?.data?.description ?? "Track description",
			type: "website",
			images: [`https://picsum.photos/id/237/200/300`],
		},
	};
}

const DetailTrackPage = async (props: any) => {
	const { params } = props;
	const session = await getServerSession(authOptions);

	const res = await sendRequest<IBackendRes<ITrackTop>>({
		url: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/tracks/${convertSlugToId(params.slug)}`,
		method: "GET",
		nextOption: { caches: "no-store" },
	});

	const resComments = await sendRequest<
		IBackendRes<IModelPaginate<ITrackComment>>
	>({
		url: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/tracks/comments`,
		method: "POST",
		queryParams: {
			current: 1,
			pageSize: 10,
			trackId: convertSlugToId(params.slug),
			sort: "-createdAt",
		},
	});

	let resLikes: IBackendRes<IModelPaginate<ITrackLike>> | null = null;
	if (session) {
		resLikes = await sendRequest({
			url: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/likes`,
			method: "GET",
			queryParams: {
				current: 1,
				pageSize: 10,
				sort: "-createdAt",
			},
			headers: {
				authorization: `Bearer ${session?.access_token}`,
			},
		});
	}

	return (
		<Container>
			<WaveTrack
				track={res.data ?? null}
				comments={resComments?.data?.result ?? []}
				likes={resLikes?.data?.result ?? []}
			/>
		</Container>
	);
};

export default DetailTrackPage;
