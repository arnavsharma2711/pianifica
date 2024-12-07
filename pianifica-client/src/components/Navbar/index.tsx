import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/state";
import { Menu, Moon, Search, Settings, Sun } from "lucide-react";
import Link from "next/link";
const Navbar = () => {
	const dispatch = useAppDispatch();
	const isSidebarCollapsed = useAppSelector(
		(state) => state.global.isSidebarCollapsed,
	);
	const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
	return (
		<div className="flex items-center justify-between bg-white px-4 py-3 dark:bg-black">
			{/* Search Bar */}
			<div className="flex items-center gap-8">
				{isSidebarCollapsed && (
					<button
						type="button"
						onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
					>
						<Menu className="h-8 w-8 cursor-pointer dark:text-white" />
					</button>
				)}
				<div className="relative flex h-min w-[200px]">
					<Search className="absolute left-[4px] top-1/2 mr-2 h-5 w-5 -translate-y-1/2 transform cursor-pointer dark:text-white" />
					<input
						className="w-full rounded border-none bg-gray-100 p-2 pl-8 placeholder-gray-500 focus:border-transparent focus:outline-none dark:bg-gray-700 dark:text-white dark:placeholder-white"
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
						<Sun className="h-6 w-6 cursor-pointer dark:text-white" />
					) : (
						<Moon className="h-6 w-6 cursor-pointer dark:text-white" />
					)}
				</button>
				<Link
					href="settings"
					className={`h-min w-min rounded p-2 ${isDarkMode ? "dark:hover:bg-gray-700" : "hover:bg-gray-200"}`}
				>
					<Settings className="h-6 w-6 cursor-pointer dark:text-white" />
				</Link>
				<div className="ml-2 mr-5 hidden min-h-[2em] w-[0.1em] bg-gray-200 md:inline-block" />
			</div>
		</div>
	);
};

export default Navbar;
