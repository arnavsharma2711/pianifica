import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import DashboardWrapper from "./dashboard-wrapper";
import AuthWrapper from "./auth-provider";
import { Toaster } from "react-hot-toast";
const raleway = Raleway({
	subsets: ["latin"],
	display: "swap",
	style: ["normal", "italic"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
	title: "Pianifica",
	description: "A project management dashboard",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${raleway.className} antialiased`}>
				<Toaster
					toastOptions={{ className: "dark:text-white dark:bg-zinc-800" }}
				/>
				<AuthWrapper>
					<DashboardWrapper>{children}</DashboardWrapper>
				</AuthWrapper>
			</body>
		</html>
	);
}
