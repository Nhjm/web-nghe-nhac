"use client";

import { AppProgressProvider } from "@bprogress/next";

const NprogressWrapper = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			{children}
			<AppProgressProvider
				height="2px"
				color="#ffffff"
				options={{ showSpinner: false }}
				shallowRouting
			/>
		</>
	);
};

export default NprogressWrapper;
