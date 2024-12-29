"use client";

import Header from "@/components/Header";
import TaskCard from "@/components/Cards/TaskCard";
import { useSearchTaskProjectUserQuery } from "@/state/api";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import ProjectCard from "@/components/Cards/ProjectCard";
import UserCard from "@/components/Cards/UserCard";
import { ChevronDown, Search as SearchIcon } from "lucide-react";

const SearchBar = ({ setValue }: { setValue: (event: React.ChangeEvent<HTMLInputElement>) => void }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedOption, setSelectedOption] = useState("Tasks");
	const options = ["Tasks", "Projects", "Users", "Teams"];

	const OptionComponent = ({ option }: { option: string }) => {
		const handleOnClick = (option: string) => {
			setSelectedOption(option);
			setIsOpen(false);
		}
		return (
			<li>
				<button type="button" onClick={() => handleOnClick(option)} className="inline-flex w-full px-4 py-2 hover:bg-gray-200 dark:hover:bg-zinc-600 dark:hover:text-white">{option}</button>
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
						{selectedOption}
						<ChevronDown className="w-4 h-4 ml-2" />
					</button>
					{
						isOpen &&
						<div className="mt-1 absolute z-10 bg-gray-100 rounded-lg shadow w-44 dark:bg-zinc-700">
							<ul className="py-2 text-sm dark:text-white">
								{options.map((option) => (
									<OptionComponent key={option} option={option} />
								))}
							</ul>
						</div>
					}
				</div>

				<div className="relative w-full">
					<input type="search"
						className="block p-2.5 w-full z-20 text-sm bg-gray-100 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300  dark:bg-zinc-700 dark:border-s-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white outline-none"
						onChange={setValue}
						placeholder={`Search ${selectedOption}`}
						required />
					<button type="submit" className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-600 rounded-e-lg border border-blue-600 hover:bg-blue-700">
						<SearchIcon className="w-5 h-5" />
						<span className="sr-only">Search</span>
					</button>
				</div>
			</div>
		</div>
	);
};

const Search = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const {
		data: searchResults,
		isLoading,
		isError,
	} = useSearchTaskProjectUserQuery(searchTerm, {
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

	return (
		<div className="p-8">
			<Header name="Search" />
			<SearchBar setValue={handleSearch} />
			<div className="p-5">
				{isLoading && <p>Loading...</p>}
				{isError && <p>Error occurred while fetching search results.</p>}
				{!isLoading && !isError && searchResults?.data && (
					<div>
						{searchResults?.data.tasks &&
							searchResults?.data.tasks?.length > 0 && <h2>Tasks</h2>}
						{searchResults?.data.tasks?.map((task) => (
							<TaskCard key={task.id} task={task} />
						))}

						{searchResults?.data.projects &&
							searchResults?.data.projects?.length > 0 && <h2>Projects</h2>}
						{searchResults?.data.projects?.map((project) => (
							<ProjectCard key={project.id} project={project} />
						))}

						{searchResults?.data.users &&
							searchResults?.data.users?.length > 0 && <h2>Users</h2>}
						{searchResults?.data.users?.map((user) => (
							<UserCard key={user.id} user={user} size="md" />
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default Search;
