import NextAuthWrapper from "@/lib/next.auth.wrapper";
import ThemeRegistry from "@/components/theme-registry/theme.registry";
import ToastWrapper from "@/lib/toast.wrapper";
import { TrackContextProvider } from "@/lib/track.wrapper";
import type { Metadata } from "next";
import NprogressWrapper from "@/lib/nprogress.wrapper";

export const metadata: Metadata = {
	metadataBase: new URL("http://localhost:3000"),
	title: "web soundcloud",
	description: "web soundcloud description",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" title="web soundcloud">
			<body>
				<ThemeRegistry>
					<NprogressWrapper>
						<NextAuthWrapper>
							<ToastWrapper>
								<TrackContextProvider>{children}</TrackContextProvider>
							</ToastWrapper>
						</NextAuthWrapper>
					</NprogressWrapper>
				</ThemeRegistry>
			</body>
		</html>
	);
}
