"use client";

import Board from "@/components/Project/BoardView";
import List from "@/components/Project/ListView";
import ProjectHeader from "@/components/Project/ProjectHeader";
import Timeline from "@/components/Project/TimelineView";
import React, { useState, useEffect } from "react";
import TableView from "@/components/Project/TableView";
import NewTaskModal from "@/components/Modal/NewTaskModal";
import type { Task } from "@/interface";

type Props = {
	params: Promise<{ id: string }>;
};

const Project = ({ params }: Props) => {
	const [id, setId] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState("Board");
	const [task, setTask] = useState<Task>();
	const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

	const handleTaskModel = (action: string, task?: Task) => {
		if (action === "edit") {
			setTask(task);
		}
		setIsModalNewTaskOpen(true);
	};

	useEffect(() => {
		params.then((resolvedParams) => {
			setId(resolvedParams.id);
		});
	}, [params]);

	if (!id) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<NewTaskModal
				isOpen={isModalNewTaskOpen}
				onClose={() => setIsModalNewTaskOpen(false)}
				project={Number(id)}
				task={task}
			/>
			<ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />
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
	);
};

export default Project;
