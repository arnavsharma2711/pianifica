"use client";
import StoreProvider, { useAppDispatch, useAppSelector } from "@/app/redux";
import AuthenticationForm from "@/components/AuthenticationForm";
import { setAccessToken } from "@/state";
import { useGetCurrentUserQuery } from "@/state/api";
import { redirect } from "next/navigation";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const accessToken = useAppSelector((state) => state.global.accessToken);
	const dispatch = useAppDispatch();
	const { data: user } = useGetCurrentUserQuery();

	if (accessToken === null && window.location.pathname !== "/") redirect("/");
	const userDetails = JSON.parse(sessionStorage.getItem("userDetails") || "{}");
	if (accessToken && userDetails && Object.keys(userDetails).length === 0) {
		if (user?.success) {
			sessionStorage.setItem("userDetails", JSON.stringify(user.data));
			sessionStorage.setItem("accessToken", accessToken);
		} else {
			sessionStorage.removeItem("userDetails");
			dispatch(setAccessToken(null));
		}
	}

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
