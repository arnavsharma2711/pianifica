"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetTasksQuery, useGetProjectsQuery, useGetUsersQuery, useGetTeamsQuery } from "@/state/api";
import { debounce } from "lodash";
import type { Project, Task, Team, User } from "@/interface";
import { ChevronDown, ChevronLeft, ChevronRight, Search as SearchIcon, XIcon } from "lucide-react";
import Header from "@/components/Header";
import ProjectCard from "@/components/Cards/ProjectCard";
import UserCard from "@/components/Cards/UserCard";
import TeamCard from "@/components/Cards/TeamCard";
import TaskCard from "@/components/Cards/TaskCard";

const LIMIT = 10;

const SearchBar = ({ defaultValue, setValue, type }: { setValue: (q: string, type: string) => void, type: string; defaultValue: string }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedType, setSelectedType] = useState(type);
	const [inputValue, setInputValue] = useState(defaultValue);

	useEffect(() => {
		setSelectedType(type);
		setInputValue(defaultValue);
	}, [type, defaultValue]);

	const optionsMap: {
		[key: string]: string;
	} = {
		"task": "Tasks",
		"project": "Projects",
		"user": "Users",
		"team": "Teams",
	};

	const OptionComponent = ({ label, value }: { label: string; value: string }) => {
		const handleOnClick = (value: string) => {
			setSelectedType(value);
			setValue("", value);
			setInputValue("");
			setIsOpen(false);
		}
		return (
			<li>
				<button type="button" onClick={() => handleOnClick(value)} className="inline-flex w-full px-4 py-2 hover:bg-gray-200 dark:hover:bg-zinc-600 dark:hover:text-white">{label}</button>
			</li>
		);
	}
	return (
		<div className="max-w-lg mx-auto">
			<div className="flex items-center justify-center">
				<div className="mb-2 text-sm font-medium sr-only dark:text-white">Your Email</div>
				<div className="relative">
					<button
						onClick={() => setIsOpen(!isOpen)}
						className="whitespace-nowrap min-w-32 z-10 inline-flex items-center justify-between py-2.5 px-4 text-sm bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-white dark:border-zinc-600"
						type="button">
						{optionsMap[selectedType]}
						<ChevronDown className="w-4 h-4 ml-2" />
					</button>
					{
						isOpen &&
						<div className="mt-1 absolute z-10 bg-gray-100 rounded-lg shadow w-44 dark:bg-zinc-700">
							<ul className="py-2 text-sm dark:text-white">
								{
									Object.keys(optionsMap).map((option) => (
										<OptionComponent key={option} label={optionsMap[option]} value={option} />
									))
								}
							</ul>
						</div>
					}
				</div>

				<div className="relative w-full">
					<input type="search"
						className="block p-2.5 w-full z-20 text-sm bg-gray-100 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300  dark:bg-zinc-700 dark:border-s-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white outline-none"
						onChange={(e) => {
							setInputValue(e.target.value);
							setValue(e.target.value, selectedType);
						}}
						placeholder={`Search ${optionsMap[selectedType]}`}
						value={inputValue}
						required
					/>
					<button
						type="button"
						onClick={() => {
							setInputValue("");
							setValue("", selectedType)
						}}
						className="absolute top-0 end-12 p-2.5 text-sm font-medium h-full text-gray-400  dark:hover:text-white"
					>
						<XIcon className="w-5 h-5 text-gray-400" />
					</button>
					<button
						type="button"
						onClick={() => setValue(inputValue, selectedType)}
						className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-600 rounded-e-lg border border-blue-600 hover:bg-blue-700">
						<SearchIcon className="w-5 h-5" />
					</button>
				</div>
			</div>
		</div>
	);
};

const SearchResults = ({ searchResults,
	limit,
	page,
	setPage,
	total_count,
	type }: {
		searchResults: User[] | Task[] | Project[] | Team[],
		limit: number,
		page: number,
		setPage: (page: number) => void,
		total_count: number;
		type: string
	}) => {
	return (
		<>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 gap-y-6 mt-5">
				{searchResults?.map((result) => {
					switch (type) {
						case "task":
							return <TaskCard key={result.id} task={result as Task} size="md" />;
						case "project":
							return <ProjectCard key={result.id} project={result as Project} />;
						case "user":
							return <UserCard key={result.id} user={result as User} size="lg" />;
						case "team":
							return <TeamCard key={result.id} team={result as Team} />;
						default:
							return null;
					}
				})
				}
			</div>
			{total_count === 0
				?
				<p className="text-center text-sm text-gray-500 dark:text-gray-400">No results found.</p>
				:
				<div className="flex justify-between items-center mt-5">
					<p className="text-center text-gray-500 dark:text-gray-400">
						Showing {Math.min((page - 1) * limit + 1, total_count)}-{Math.min(page * limit, total_count)} of {total_count} results.
					</p>
					<div className="flex items-center justify-center ml-2 gap-2">
						<button
							type="button"
							className={`p-2 rounded-lg bg-gray-200 dark:bg-zinc-600 hover:bg-gray-300 dark:hover:bg-zinc-500 ${page === 1 ? "cursor-not-allowed opacity-25 bg-gray-300 hover:bg-gray-300" : ""}`}
							onClick={() => setPage(page - 1)}
							disabled={page === 1}
						>
							<ChevronLeft size={25}
							/>
						</button>
						<button
							type="button"
							className={`p-2 rounded-lg bg-gray-200 dark:bg-zinc-600 hover:bg-gray-300 dark:hover:bg-zinc-500 ${page * limit >= total_count ? "cursor-not-allowed opacity-25 bg-gray-300 hover:bg-gray-300" : ""}`}
							onClick={() => setPage(page + 1)}
							disabled={page * limit >= total_count}
						>
							<ChevronRight size={25}
							/>
						</button>
					</div>

				</div>}
		</>
	)
};
const allowedTypes = new Set(["team", "user", "project", "task"]);

const Search = () => {
	const searchParams = useSearchParams();
	const { replace } = useRouter();

	const search = searchParams.get('search')?.toString() || "";
	const type = allowedTypes.has(searchParams.get("type")?.toString() || "")
		? searchParams.get("type")?.toString() || "task"
		: "task";

	const page = Number(searchParams.get('page')) || 1;

	const { data: taskResults, isLoading: isLoadingTasks, isError: isErrorTasks } = useGetTasksQuery({
		search,
		limit: LIMIT,
		page,
	}, { skip: type !== "task" });

	const { data: projectResults, isLoading: isLoadingProjects, isError: isErrorProjects } = useGetProjectsQuery({
		search,
		limit: LIMIT,
		page,
	}, { skip: type !== "project" });

	const { data: userResults, isLoading: isLoadingUsers, isError: isErrorUsers } = useGetUsersQuery({
		search,
		limit: LIMIT,
		page,
	}, { skip: type !== "user" });

	const { data: teamResults, isLoading: isLoadingTeams, isError: isErrorTeams } = useGetTeamsQuery({
		search,
		limit: LIMIT,
		page,
	}, { skip: type !== "team" });

	const searchResults = type === "task" ? taskResults :
		type === "project" ? projectResults :
			type === "user" ? userResults :
				type === "team" ? teamResults : null;

	const isLoading = type === "task" ? isLoadingTasks :
		type === "project" ? isLoadingProjects :
			type === "user" ? isLoadingUsers :
				type === "team" ? isLoadingTeams : false;

	const isError = type === "task" ? isErrorTasks :
		type === "project" ? isErrorProjects :
			type === "user" ? isErrorUsers :
				type === "team" ? isErrorTeams : false;

	const handleSearch = debounce((q: string, type: string, page = 1) => {
		const params = new URLSearchParams(searchParams);
		if (q) {
			params.set("search", q);
		} else {
			params.delete("search");
		}
		if (type) {
			params.set("type", type);
		} else {
			params.delete("type");
		}
		if (page) {
			params.set("page", page.toString());
		} else {
			params.delete("page");
		}
		replace(`/search?${params.toString()}`);
	}, 500);

	const handleSearchPage = (page: number) => {
		const params = new URLSearchParams(searchParams);
		params.set("page", page.toString());
		replace(`/search?${params.toString()}`);
	}

	useEffect(() => {
		return handleSearch.cancel;
	}, [handleSearch]);
	useEffect(() => {
		document.title = "Search - Pianifica";
	}, []);

	return (
		<div className="p-8">
			<Header name="Search" />
			<SearchBar setValue={handleSearch} type={type} defaultValue={search} />
			<div className="py-5">
				{isLoading && <p>Loading...</p>}
				{isError && <p>Error occurred while fetching search results.</p>}
				{!isLoading && !isError && searchResults?.data && (
					<SearchResults
						searchResults={searchResults.data}
						limit={LIMIT}
						page={page}
						setPage={handleSearchPage}
						total_count={searchResults.total_count || 0}
						type={type}
					/>
				)}
			</div>
		</div>
	);
};

export default Search;