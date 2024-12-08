"use client";

import Board from "@/components/Pages/Project/BoardView";
import List from "@/components/Pages/Project/ListView";
import ProjectHeader from "@/components/Pages/Project/ProjectHeader";
import Timeline from "@/components/Pages/Project/TimelineView";
import React, { useState, useEffect } from "react";
import TableView from "@/components/Pages/Project/TableView";
import NewTaskModal from "@/components/Modal/NewTaskModal";

type Props = {
	params: Promise<{ id: string }>;
};

const Project = ({ params }: Props) => {
	const [id, setId] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState("Board");
	const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

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
				id={id}
			/>
			<ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />
			{activeTab === "Board" && (
				<Board id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
			)}
			{activeTab === "List" && (
				<List id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
			)}
			{activeTab === "Timeline" && (
				<Timeline id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
			)}
			{activeTab === "Table" && (
				<TableView id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
			)}
		</div>
	);
};

export default Project;
