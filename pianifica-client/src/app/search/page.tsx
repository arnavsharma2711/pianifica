"use client";

import Header from "@/components/Header";
import TaskCard from "@/components/Cards/TaskCard";
import { useSearchTaskProjectUserQuery } from "@/state/api";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import ProjectCard from "@/components/Cards/ProjectCard";
import UserCard from "@/components/Cards/UserCard";

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
			<div>
				<input
					type="text"
					placeholder="Search..."
					className="w-1/2 rounded border p-3 shadow"
					onChange={handleSearch}
				/>
			</div>
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
							<UserCard key={user.id} user={user} />
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default Search;
