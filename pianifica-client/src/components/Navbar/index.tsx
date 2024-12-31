'use client';

import { useAppDispatch, useAppSelector } from "@/app/redux";
import type { Project, Team, User, Task } from "@/interface";
import { setAccessToken, setIsDarkMode, setIsSidebarCollapsed } from "@/state";
import { LogOutIcon, Menu, Moon, Search, Settings, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DropdownMenu from "../DropdownMenu";
import { api, useGetCurrentUserQuery, useGlobalSearchQuery } from "@/state/api";
import { useEffect, useState } from "react";
import { debounce } from "lodash";
import UserCard from "../Cards/UserCard";
import TeamCard from "../Cards/TeamCard";
import TaskCard from "../Cards/TaskCard";
import ProjectCard from "../Cards/ProjectCard";

const Navbar = () => {
	const dispatch = useAppDispatch();
	const isSidebarCollapsed = useAppSelector(
		(state) => state.global.isSidebarCollapsed,
	);
	const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

	const { data: currentUser } = useGetCurrentUserQuery();

	const SearchBar = () => {
		const [searchTerm, setSearchTerm] = useState("");
		const {
			data: searchResults,
			isLoading,
			isError,
		} = useGlobalSearchQuery({
			search: searchTerm,
			limit: 2,
			page: 1
		}, {
			skip: searchTerm.length < 3,
		});

		const handleSearch = debounce(
			(event: React.ChangeEvent<HTMLInputElement>) => {
				setSearchTerm(event.target.value);
			},
			500,
		);

		useEffect(() => {
			return handleSearch.cancel;
		}, [handleSearch.cancel]);

		type ResultArrayProps = {
			label: string;
			type: "task" | "project" | "team" | "user";
			total_count: number;
			data: Task[] | Project[] | Team[] | User[];
		};

		const ResultArray = ({ label, type, total_count, data }: ResultArrayProps) => {
			const href = `/search?type=${type}&search=${searchTerm}`;
			return (
				<>
					{(total_count ?? 0) > 0 && (
						<div className="p-2">
							<span>{label}:</span>
							<>
								{data?.map((result) => (
									<div key={result.id} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-700">
										{type === "task" && "title" in result && <TaskCard task={result as Task} size="sm" />}
										{type === "project" && "name" in result && <ProjectCard project={result as Project} size="sm" />}
										{type === "team" && "name" in result && result.id && typeof result.id === 'number' && <TeamCard team={result as Team} />}
										{type === "user" && "username" in result && <UserCard user={result} size="md" />}
									</div>
								))}
								{
									total_count > 2 &&
									<Link href={href} className="w-full flex items-center justify-end">
										<span className="text-blue-400">View more</span>
									</Link>
								}
							</>

						</div>
					)}
				</>
			);
		};

		return (
			<div className="hidden md:flex relative items-center w-[400px]">
				<Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-white cursor-pointer" />
				<input
					className="w-full rounded-full border-none bg-gray-100 pl-10 pr-4 py-2 placeholder-gray-500 focus:border-transparent focus:outline-none dark:bg-gray-700 dark:placeholder-white"
					placeholder="Search..."
					type="search"
					onChange={handleSearch}
				/>

				{/* Search Results */}
				{
					searchTerm.length < 3 ? <div className="absolute top-full left-0 w-full bg-white dark:bg-zinc-800 shadow-md rounded-b-lg">

					</div> :
						<div className="absolute top-full left-0 w-full bg-white dark:bg-zinc-800 shadow-md rounded-b-lg" onClick={() => setSearchTerm("")} onKeyUp={(e) => e.key === 'Enter' && setSearchTerm("")}>
							{isLoading && <p>Loading...</p>}
							{isError && <p>Error fetching search results</p>}
							<div className="flex flex-col">
								<ResultArray label="Tasks" type="task" total_count={searchResults?.data?.total_count?.task ?? 0} data={searchResults?.data?.tasks || []} />
								<ResultArray label="Projects" type="project" total_count={searchResults?.data?.total_count?.project ?? 0} data={searchResults?.data?.projects || []} />
								<ResultArray label="Teams" type="team" total_count={searchResults?.data?.total_count?.team ?? 0} data={searchResults?.data?.teams || []} />
								<ResultArray label="Users" type="user" total_count={searchResults?.data?.total_count?.user ?? 0} data={searchResults?.data?.users || []} />
							</div>

						</div>
				}

			</div>
		);
	}

	const UserButton = ({ user }: { user: User }) => {
		const handleLogout = () => {
			sessionStorage.removeItem("userDetails");
			dispatch(setAccessToken(null));
			dispatch(api.util.invalidateTags(["Projects", "Tasks", "Task", "UserTasks", "Users", "Teams", "Team"]));
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
		<div className="fixed w-full z-40 flex items-center justify-between bg-white px-4 py-3 shadow-md dark:bg-black mb-40">
			<div className="flex items-center gap-8">
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
			</div>
			{/* Search Bar */}
			<SearchBar />

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
				{currentUser?.data && <UserButton user={currentUser.data} />}
			</div>
		</div>
	);
};

export default Navbar;
