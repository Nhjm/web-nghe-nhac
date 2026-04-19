import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import MainSlide from "@/components/main/main.slide";
import { sendRequest } from "@/utils/api";
import { Container } from "@mui/material";
import { getServerSession } from "next-auth/next";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  console.log("check session server", session);

  const chills = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/tracks/top`,
    method: "POST",
    body: { category: "CHILL", limit: 10 },
  });

  const party = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/tracks/top`,
    method: "POST",
    body: { category: "PARTY", limit: 10 },
  });

  const workout = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/tracks/top`,
    method: "POST",
    body: { category: "WORKOUT", limit: 10 },
  });

  return (
    <Container>
      <MainSlide data={chills?.data ?? []} title="Chill" />
      <MainSlide data={party?.data ?? []} title="Party" />
      <MainSlide data={workout?.data ?? []} title="Workout" />
    </Container>
  );
}
