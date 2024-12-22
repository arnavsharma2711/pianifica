"use client";
import StoreProvider, { useAppSelector } from "@/app/redux";
import AuthenticationForm from "@/components/AuthenticationForm";
import { redirect } from "next/navigation";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const accessToken = useAppSelector((state) => state.global.accessToken);
	if (accessToken === null && window.location.pathname !== "/") redirect("/");
	return <>{accessToken === null ? <AuthenticationForm /> : children}</>;
};

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
	return (
		<StoreProvider>
			<AuthProvider>{children}</AuthProvider>
		</StoreProvider>
	);
};

export default AuthWrapper;
