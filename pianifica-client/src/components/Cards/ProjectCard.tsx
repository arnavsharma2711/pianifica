import type { Project } from "@/interface";
import React from "react";

type Props = {
	project: Project;
	size?: "sm" | "md";
};

const ProjectCard = ({ project, size = "md" }: Props) => {
	return (
		<div className="">
			<h3 className="font-bold">{project.name}</h3>
			<p className="ml-2">{project.description}</p>
			{
				size === "md" && (
					<>
						<p>Start Date: {project.startDate}</p>
						<p>End Date: {project.endDate}</p>
					</>
				)
			}

		</div>
	);
};

export default ProjectCard;
