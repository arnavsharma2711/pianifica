"use client";

import { DataTable } from "@/components/DataTable";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import NewProjectModal from "@/components/Modal/NewProjectModal";
import type { Project } from "@/interface";
import { useGetProjectsQuery } from "@/state/api";
import { PlusSquare } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Projects = () => {
	const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false);

	const { data: projects, error, isLoading } = useGetProjectsQuery();

	if (isLoading) return <Loading />;
	if (error || !projects)
		return <div>An error occurred while fetching projects</div>;

	const projectColumns = [
		{
			header: "Project Name",
			accessorKey: "name" as keyof Project,
			cell: (project: Project) => (
				<Link href={`/project/${project.id}`}>{project.name}</Link>
			),
		},
		{
			header: "Description",
			accessorKey: "description" as keyof Project,
		},
		{
			header: "Start Date",
			accessorKey: "startDate" as keyof Project,
			cell: (project: Project) =>
				project.startDate
					? new Date(project.startDate).toLocaleDateString()
					: "N/A",
		},
		{
			header: "End Date",
			accessorKey: "endDate" as keyof Project,
			cell: (project: Project) =>
				project.startDate
					? new Date(project.startDate).toLocaleDateString()
					: "N/A",
		},
	];

	return (
		<div className="flex w-full flex-col p-8">
			<NewProjectModal
				isOpen={isModalNewProjectOpen}
				onClose={() => setIsModalNewProjectOpen(false)}
			/>
			<div className="pb-6 pt-6 lg:pb-4 lg:pt-8">
				<Header
					name="Project Boards"
					buttonComponent={
						<button
							type="button"
							className="flex items-center rounded-md bg-blue-primary px-3 py-2 text-white hover:bg-blue-700"
							onClick={() => setIsModalNewProjectOpen(true)}
						>
							<PlusSquare className="mr-2 h-5 w-5" /> New Boards
						</button>
					}
				/>
			</div>
			<DataTable
				data={projects?.data}
				columns={projectColumns}
				withIndex={true}
			/>
		</div>
	);
};

export default Projects;
