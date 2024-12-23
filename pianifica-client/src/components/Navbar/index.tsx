import { useAppDispatch, useAppSelector } from "@/app/redux";
import type { User } from "@/interface";
import { setAccessToken, setIsDarkMode, setIsSidebarCollapsed } from "@/state";
import { LogOutIcon, Menu, Moon, Search, Settings, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DropdownMenu from "../DropdownMenu";
const Navbar = () => {
	const dispatch = useAppDispatch();
	const isSidebarCollapsed = useAppSelector(
		(state) => state.global.isSidebarCollapsed,
	);
	const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

	const user = JSON.parse(sessionStorage.getItem("userDetails") || "{}");

	const UserButton = ({ user }: { user: User }) => {
		const handleLogout = () => {
			sessionStorage.removeItem("userDetails");
			dispatch(setAccessToken(null));
		};
		return (
			<>
				<DropdownMenu
					toggle={
						<div className="h-9 w-9 overflow-hidden rounded-full flex items-center justify-center">
							<Image
								src={user?.profilePictureUrl || "/default-profile-picture.webp"}
								alt="profile picture"
								width={100}
								height={50}
							/>
						</div>
					}
					options={[
						{
							key: "profile",
							value: `Hi, ${user?.firstName}`,
							className: "justify-center",
						},
						{
							key: "logout",
							icon: <LogOutIcon size={20} />,
							value: "Logout",
							onClick: handleLogout,
						},
					]}
					position="right"
					marginTop="mt-14"
				/>
			</>
		);
	};

	return (
		<div className="flex items-center justify-between bg-white px-4 py-3 dark:bg-black">
			<div className="flex items-center gap-8">
				{isSidebarCollapsed && (
					<div className="flex items-center gap-2">
						<button
							type="button"
							className="rounded-full p-2 dark:hover:bg-zinc-800 hover:bg-gray-200"
							onClick={() =>
								dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))
							}
						>
							<Menu className="text-gray-800 dark:text-white" />
						</button>
						<div className="text-xl font-bold text-gray-800 dark:text-white font-mono">
							PIANIFICA
						</div>
					</div>
				)}
			</div>
			{/* Search Bar */}
			<div className="hidden md:flex relative items-center w-[400px]">
				<Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-white cursor-pointer" />
				<input
					className="w-full rounded-full border-none bg-gray-100 pl-10 pr-4 py-2 placeholder-gray-500 focus:border-transparent focus:outline-none dark:bg-gray-700 dark:placeholder-white"
					placeholder="Search..."
					type="search"
				/>
			</div>
			{/* Navbar Items */}
			<div className="flex items-center">
				<button
					type="button"
					onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
					className={`rounded-full p-2 ${isDarkMode ? "dark:hover:bg-zinc-800" : "hover:bg-gray-200"}`}
				>
					{isDarkMode ? (
						<Sun className="h-6 w-6 cursor-pointer" />
					) : (
						<Moon className="h-6 w-6 cursor-pointer" />
					)}
				</button>
				<Link
					href="/settings"
					className={`h-min w-min rounded-full p-2 ${isDarkMode ? "dark:hover:bg-zinc-800" : "hover:bg-gray-200"}`}
				>
					<Settings className="h-6 w-6 cursor-pointer" />
				</Link>
				<div className="ml-2 mr-5 hidden min-h-[2em] w-[0.1em] bg-gray-200 md:inline-block" />
				<UserButton user={user} />
			</div>
		</div>
	);
};

export default Navbar;
