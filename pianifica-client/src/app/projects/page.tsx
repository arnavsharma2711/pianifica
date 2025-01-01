"use client";

import Breadcrumb from "@/components/Breadcrumb";
import { DataTable } from "@/components/DataTable";
import ErrorComponent from "@/components/Error";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import NewProjectModal from "@/components/Modal/NewProjectModal";
import type { Project } from "@/interface";
import { useGetCurrentUserQuery, useGetProjectsQuery } from "@/state/api";
import { PlusSquare } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const Projects = () => {
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false);

	const { data: projects, error, isLoading } = useGetProjectsQuery({});
	const { data: currentUser } = useGetCurrentUserQuery();

	useEffect(() => {
		document.title = "Projects - Pianifica";
	}, []);

	if (isLoading) return <Loading />;
	if (error || !projects)
		return <ErrorComponent message={"An error occurred while fetching projects"} />

	const pagination = {
		page,
		limit,
		total: projects.total_count || 10,
		setPage,
		setLimit,
	};

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
		<>
			<Breadcrumb
				links={[
					{ value: "Projects", link: "/projects" },
				]}
			/>
			<div className="flex w-full flex-col px-8 pt-2">
				<NewProjectModal
					isOpen={isModalNewProjectOpen}
					onClose={() => setIsModalNewProjectOpen(false)}
				/>
				<Header
					name="Project Boards"
					buttonComponent={
						currentUser?.data?.role === "ORG_ADMIN" ?
							(
								<button
									type="button"
									className="flex items-center rounded-md bg-blue-primary px-3 py-2 text-white hover:bg-blue-700"
									onClick={() => setIsModalNewProjectOpen(true)}
								>
									<PlusSquare className="mr-2 h-5 w-5" /> New Boards
								</button>
							)
							: undefined
					}
				/>
				<DataTable
					data={projects?.data}
					columns={projectColumns}
					withIndex={true}
					showPagination={true}
					pagination={pagination}
				/>
			</div>
		</>
	);
};

export default Projects;
