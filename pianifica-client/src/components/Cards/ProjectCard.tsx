import type { Project } from "@/interface";
import { Calendar } from "lucide-react";
import React from "react";

type Props = {
	project: Project;
	size?: "sm" | "md";
	backgroundColor?: string;
};

const ProjectCard = ({ project, size = "md", backgroundColor = "bg-gray-200 dark:bg-zinc-900" }: Props) => {
	return (
		<div className={`${backgroundColor} dark:border-zinc-600 rounded-lg  ${size === "sm" ? "p-1" : "p-6 m-1 border shadow-md"}`}>
			<h2 className={`font-bold mb-2 ${size === "sm" ? "text-lg" : "text-xl"}`}>{project.name}</h2>
			{project.description && (
				<p className={`max-w-sm text-gray-500 ${size === "sm" ? "text-xs" : "text-sm mb-4 "}`}>{project.description}</p>
			)}
			{size === "md" && (
				<div className={"flex gap-2 items-center justify-start text-gray-500 text-sm"}>
					<Calendar size={15} />
					{project.startDate && (
						<span>{new Date(project.startDate).toLocaleDateString()}</span>
					)}
					{" - "}
					{project.endDate && (
						<span>{new Date(project.endDate).toLocaleDateString()}</span>
					)}
				</div>
			)}
		</div>
	);
};

export default ProjectCard;
