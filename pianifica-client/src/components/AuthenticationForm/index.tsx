import type React from "react";
import { useState } from "react";
import { api, useLoginUserMutation, useRegisterUserMutation } from "@/state/api";
import { useAppDispatch } from "@/app/redux";
import { setAccessToken } from "@/state";
import InputField from "../FormFields";

const AuthenticationForm = () => {
	const [view, setView] = useState("login");
	const [displayFields, setDisplayFields] = useState("login");
	const [emailOrUsername, setEmailOrUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [username, setUsername] = useState("");

	const [error, setError] = useState("");

	const handleViewChange = (view: string) => {
		setTimeout(() => {
			setDisplayFields(view);
		}, 200);
		setView(view);
		setError("");
	};

	const [loginUser, { isLoading: isLoggingIn }] = useLoginUserMutation();
	const [registerUser, { isLoading: isRegistering }] =
		useRegisterUserMutation();
	const dispatch = useAppDispatch();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const user = await loginUser({ emailOrUsername, password }).unwrap();
			if (user?.success) {
				dispatch(setAccessToken(user.data.accessToken));
				sessionStorage.setItem(
					"userDetails",
					JSON.stringify(user.data.userInfo),
				);
				sessionStorage.setItem("accessToken", user.data.accessToken);
				dispatch(api.util.invalidateTags(["Projects", "Tasks", "Task", "UserTasks", "Users", "Teams", "Team"]));
			} else {
				setError(user?.message);
			}
		} catch (err) {
			console.error("Failed to login:", err);
		}
	};

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}
		try {
			const user = await registerUser({
				organizationId: 1,
				firstName,
				lastName,
				password,
				username,
				email,
			}).unwrap();
			if (user?.success) {
				dispatch(setAccessToken(user.data.accessToken));
				sessionStorage.setItem(
					"userDetails",
					JSON.stringify(user.data.userInfo),
				);
				sessionStorage.setItem("accessToken", user.data.accessToken);
			} else {
				setError(user?.message);
			}
		} catch (err) {
			console.error("Failed to register:", err);
		}
	};

	return (
		<div className="w-full h-full min-h-full flex flex-row items-center justify-center p-4 lg:p-20">
			<div className="w-full h-full bg-gray-100 dark:bg-zinc-800  flex items-center justify-center rounded-md shadow-md overflow-hidden relative">
				<div
					className={`w-full h-full transform transition-transform duration-500 ${view === "login" ? "lg:translate-x-0" : "lg:translate-x-full"}`}
				>
					<div className=" w-full h-full  box-border flex flex-col items-center justify-center p-10">
						<h1 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">
							{displayFields === "login"
								? "Log in to Pianifica"
								: "Register a new account"}
						</h1>
						<form
							className="w-full h-full box-border flex flex-col items-center justify-center"
							onSubmit={view === "login" ? handleLogin : handleRegister}
						>
							<div className="w-full h-full flex items-center justify-center flex-col gap-4">
								{displayFields === "login" && (
									<>
										<InputField
											label="Email or Username"
											value={emailOrUsername}
											placeholder="john.doe@email.com"
											onChange={(e) => setEmailOrUsername(e.target.value)}
										/>
										<InputField
											type="password"
											label="Password"
											value={password}
											placeholder="Password"
											onChange={(e) => setPassword(e.target.value)}
										/>
									</>
								)}
								{displayFields === "register" && (
									<>
										<InputField
											label="Email"
											value={email}
											placeholder="john.doe@email.com"
											onChange={(e) => setEmail(e.target.value)}
										/>
										<InputField
											label="Username"
											value={username}
											placeholder="john_doe"
											onChange={(e) => setUsername(e.target.value)}
										/>

										<InputField
											label="First Name"
											value={firstName}
											placeholder="John"
											onChange={(e) => setFirstName(e.target.value)}
										/>
										<InputField
											label="Last Name"
											value={lastName}
											placeholder="Doe"
											onChange={(e) => setLastName(e.target.value)}
										/>
										<InputField
											type="password"
											label="Password"
											value={password}
											placeholder="Password"
											onChange={(e) => setPassword(e.target.value)}
										/>
										<InputField
											label="Confirm Password"
											value={confirmPassword}
											placeholder="Confirm password"
											onChange={(e) => setConfirmPassword(e.target.value)}
										/>
									</>
								)}
							</div>
							{error && <p className="w-full text-red-500">{error}</p>}
							<button
								type="submit"
								className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600
					`}
								disabled={isLoggingIn || isRegistering}
							>
								{view === "login" ? "Login" : "Register"}
							</button>
						</form>
						<div className="mt-4 w-full flex gap-1 items-center justify-center text-lg">
							{view === "login" ? (
								<>
									<span>{"Don't have an account?"}</span>
									<div
										className="text-blue-500 cursor-pointer font-bold"
										onKeyDown={() => handleViewChange("register")}
										onClick={() => handleViewChange("register")}
									>
										Create one here
									</div>
								</>
							) : (
								<>
									<span>Already have an account?</span>
									<div
										className="text-blue-500 cursor-pointer font-bold"
										onKeyDown={() => handleViewChange("login")}
										onClick={() => handleViewChange("login")}
									>
										Sign in here
									</div>
								</>
							)}
						</div>
					</div>
				</div>
				<div
					className={`hidden lg:flex w-full h-full transform transition-transform duration-500 items-center justify-center ${view === "login" ? "translate-x-0" : "-translate-x-full"}`}
				>
					<img
						className="w-full h-full object-cover rounded-r-md"
						src="/login.webp"
						alt="Login"
					/>
				</div>
			</div>
		</div>
	);
};

export default AuthenticationForm;
