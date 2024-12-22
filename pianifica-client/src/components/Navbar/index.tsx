import { useAppDispatch, useAppSelector } from "@/app/redux";
import type { User } from "@/interface";
import { setAccessToken, setIsDarkMode, setIsSidebarCollapsed } from "@/state";
import { LogOutIcon, Menu, Moon, Search, Settings, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
const Navbar = () => {
	const dispatch = useAppDispatch();
	const isSidebarCollapsed = useAppSelector(
		(state) => state.global.isSidebarCollapsed,
	);
	const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

	const user = JSON.parse(sessionStorage.getItem("userDetails") || "{}");

	console.log(user);

	const UserButton = ({ user }: { user: User }) => {
		const [isOpen, setIsOpen] = useState(false);
		const ref = useRef<HTMLDivElement>(null);

		const handleButtonClick = () => {
			setIsOpen(!isOpen);
		};

		const handleLogout = () => {
			sessionStorage.removeItem("userDetails");
			dispatch(setAccessToken(null));
		};

		const handleClickOutside = (event: MouseEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		useEffect(() => {
			document.addEventListener("mousedown", handleClickOutside);
			return () => {
				document.removeEventListener("mousedown", handleClickOutside);
			};
		}, []);

		return (
			<div className="relative" ref={ref}>
				<button
					type="button"
					onClick={handleButtonClick}
					className="flex p-2 rounded-lg gap-2 items-center hover:bg-gray-100 dark:hover:bg-gray-700"
				>
					<div>
						{user?.firstName} {user?.lastName}
					</div>
					{user.profilePictureUrl && (
						<Image
							src={user.profilePictureUrl || "/default-profile-picture.webp"}
							alt="profile picture"
							width={32}
							height={32}
							className="rounded-full"
						/>
					)}
				</button>
				{isOpen && (
					<ul className="absolute z-30 right-0 mt-2 w-max bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-zinc-700 rounded-md shadow-lg">
						<li
							className="flex flex-row gap-2 justify-end items-center font-bold px-6 py-4 hover:bg-gray-200 hover:dark:bg-gray-800"
							onClick={handleLogout}
						>
							Logout
							<LogOutIcon size={20} />
						</li>
					</ul>
				)}
			</div>
		);
	};

	return (
		<div className="flex items-center justify-between bg-white px-4 py-3 dark:bg-black">
			{/* Search Bar */}
			<div className="flex items-center gap-8">
				{isSidebarCollapsed && (
					<button
						type="button"
						className="rounded p-2 dark:hover:bg-gray-700 hover:bg-gray-200"
						onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
					>
						<Menu className="text-gray-800 dark:text-white" />
					</button>
				)}
				<div className="relative flex h-min w-[200px]">
					<Search className="absolute left-[4px] top-1/2 mr-2 h-5 w-5 -translate-y-1/2 transform cursor-pointer" />
					<input
						className="w-full rounded border-none bg-gray-100 p-2 pl-8 placeholder-gray-500 focus:border-transparent focus:outline-none dark:bg-gray-700 dark:placeholder-white"
						placeholder="Search..."
						type="search"
					/>
				</div>
			</div>
			{/* Navbar Items */}
			<div className="flex items-center">
				<button
					type="button"
					onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
					className={`rounded p-2 ${isDarkMode ? "dark:hover:bg-gray-700" : "hover:bg-gray-200"}`}
				>
					{isDarkMode ? (
						<Sun className="h-6 w-6 cursor-pointer" />
					) : (
						<Moon className="h-6 w-6 cursor-pointer" />
					)}
				</button>
				<Link
					href="/settings"
					className={`h-min w-min rounded p-2 ${isDarkMode ? "dark:hover:bg-gray-700" : "hover:bg-gray-200"}`}
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
