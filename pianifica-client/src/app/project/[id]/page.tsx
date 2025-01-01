"use client";

import Board from "@/components/Project/BoardView";
import List from "@/components/Project/ListView";
import ProjectHeader from "@/components/Project/ProjectHeader";
import Timeline from "@/components/Project/TimelineView";
import React, { useState, useEffect } from "react";
import TableView from "@/components/Project/TableView";
import NewTaskModal from "@/components/Modal/NewTaskModal";
import type { Task } from "@/interface";
import { useGetProjectQuery } from "@/state/api";
import Breadcrumb from "@/components/Breadcrumb";
import Loading from "@/components/Loading";
import { useRouter, useSearchParams } from "next/navigation";
import ErrorComponent from "@/components/Error";

type Props = {
	params: Promise<{ id: string }>;
};

const allowedTabs = new Set(["Board", "List", "Timeline", "Table"]);

const Project = ({ params }: Props) => {
	const searchParams = useSearchParams();
	const { replace } = useRouter();

	const [id, setId] = useState<string | null>(null);
	const activeTab = allowedTabs.has(searchParams.get("tab")?.toString() || "")
		? searchParams.get("tab")?.toString() || "Board"
		: "Board";
	const [task, setTask] = useState<Task>();
	const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

	const { data: project, isLoading, isError } = useGetProjectQuery(
		{ projectId: Number(id) },
		{ skip: id === null }
	);
	const handleTaskModel = (action: string, task?: Task) => {
		if (action === "edit") {
			setTask(task);
		}
		setIsModalNewTaskOpen(true);
	};

	const handleActiveTab = (tabName: string) => {
		if (tabName === activeTab) return;
		const params = new URLSearchParams(searchParams);
		params.set("tab", tabName);
		replace(`/project/${id}?${params.toString()}`);
	}

	useEffect(() => {
		params.then((resolvedParams) => {
			setId(resolvedParams.id);
		});
	}, [params]);
	useEffect(() => {
		document.title = `${project?.data?.name} - Pianifica` || "Project Board - Pianifica";
	}, [project]);

	if (!id || isLoading) {
		return <Loading />;
	}
	if (isError) {
		return <ErrorComponent message={`Project with id ${id} not found`} breadcrumbLinks={[
			{
				value: "Projects",
				link: '/projects',
			},
		]} />;
	}
	return (
		<>
			<Breadcrumb
				links={[
					{ value: "Projects", link: "/projects" },
					{ value: project?.data?.name || "Project Board", link: `/project/${id}` },
				]}
			/>
			<div>
				<NewTaskModal
					isOpen={isModalNewTaskOpen}
					onClose={() => setIsModalNewTaskOpen(false)}
					project={Number(id)}
					task={task}
				/>
				<ProjectHeader
					activeTab={activeTab}
					setActiveTab={handleActiveTab}
					projectName={project?.data?.name || "Project Board"}
					projectId={Number(id)}
					isBookmarked={project?.data?.bookmarked || false}
				/>
				{activeTab === "Board" && (
					<Board id={id} handleTaskModel={handleTaskModel} />
				)}
				{activeTab === "List" && (
					<List id={id} handleTaskModel={handleTaskModel} />
				)}
				{activeTab === "Timeline" && (
					<Timeline id={id} handleTaskModel={handleTaskModel} />
				)}
				{activeTab === "Table" && (
					<TableView id={id} handleTaskModel={handleTaskModel} />
				)}
			</div>
		</>
	);
};

export default Project;
