"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import { useGetProjectsQuery, useGetUserOrganizationQuery } from "@/state/api";
import {
	AlertCircle,
	AlertOctagon,
	AlertTriangle,
	Briefcase,
	ChevronDown,
	ChevronUp,
	HomeIcon,
	Layers3,
	LockIcon,
	type LucideIcon,
	Menu,
	Search,
	Presentation,
	ShieldAlert,
	User,
	Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface SidebarLinkProps {
	href: string;
	icon: LucideIcon;
	label: string;
}

const SidebarLink = ({ href, icon: Icon, label }: SidebarLinkProps) => {
	const pathname = usePathname();
	const isActive =
		pathname === href || (pathname === "/" && href === "/dashboard");
	return (
		<Link href={href} className="w-full">
			<div
				className={`relative flex cursor-pointer items-center gap-3 transition-colors hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-700 ${isActive ? "bg-gray-100 text-white dark:bg-gray-600" : ""} justify-start px-8 py-3`}
			>
				{isActive && (
					<div className="absolute left-0 top-0 h-full w-[5px] bg-blue-200" />
				)}
				<Icon className="h-6 w-6 text-gray-800 dark:text-gray-100" />

				<span className="font-medium text-gray-800 dark:text-gray-100">
					{label}
				</span>
			</div>
		</Link>
	);
};

const Sidebar = () => {
	const [showProjects, setShowProjects] = useState(true);
	const [showPriority, setShowPriority] = useState(true);

	const { data: project } = useGetProjectsQuery();
	const { data: organization } = useGetUserOrganizationQuery();

	const dispatch = useAppDispatch();
	const isSidebarCollapsed = useAppSelector(
		(state) => state.global.isSidebarCollapsed,
	);
	return (
		<div
			className={`
		fixed flex flex-col h-full justify-between shadow-xl transition-all duration-300 z-40 dark:bg-black overflow-y-auto bg-white ${isSidebarCollapsed ? "w-0 hidden" : "w-64"}
	`}
		>
			<div className="flex h-full w-full flex-col justify-start">
				{/* Pianifica Logo */}
				<div className="z-50 flex min-h-[56px] w-64 items-center justify-between bg-white px-6 dark:bg-black">
					{!isSidebarCollapsed && (
						<button
							type="button"
							className="rounded p-3 dark:hover:bg-gray-700 hover:bg-gray-200"
							onClick={() =>
								dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))
							}
						>
							<Menu className="text-gray-800 dark:text-white" />
						</button>
					)}
					<div className="text-xl font-bold text-gray-800 dark:text-white font-mono">
						PIANIFICA
					</div>
				</div>

				{/* Organization */}
				<div className="flex items-center gap-5 border-y-[1.5px] border-gray-200 px-8 py-4 dark:border-gray-700">
					<Image src="/team.png" width={40} height={40} alt="logo" />
					<div>
						<h3 className="text-md font-bold tracking-wide dark:text-gray-200">
							{organization?.data?.name}
						</h3>
						<div className="mt-1 flex items-start gap-2">
							<LockIcon className="mt-[0.1rem] h-3 w-3 text-gray-500 dark:text-gray-400" />
							<p className="text-xs text-gray-500">Private</p>
						</div>
					</div>
				</div>
				<nav className="z-10 w-full">
					<SidebarLink icon={HomeIcon} label="Home" href="/" />
					<SidebarLink icon={Search} label="Search" href="/search" />
					<SidebarLink icon={Presentation} label="Projects" href="/projects" />
					<SidebarLink icon={Briefcase} label="Timeline" href="/timeline" />
					<SidebarLink icon={Users} label="Teams" href="/teams" />
					<SidebarLink icon={User} label="Users" href="/users" />
				</nav>

				{/* Projects */}
				<button
					type="button"
					onClick={() => setShowProjects((prev) => !prev)}
					className="flex w-full items-center justify-between px-8 py-3 text-gray-500 "
				>
					<span className="">Projects</span>
					{showProjects ? (
						<ChevronUp className="h-5 w-5" />
					) : (
						<ChevronDown className="h-5 w-5" />
					)}
				</button>

				{/* Projects Links */}
				{showProjects &&
					project?.data?.map((project) => (
						<SidebarLink
							key={project.id}
							icon={Briefcase}
							label={project.name}
							href={`/project/${project.id}`}
						/>
					))}

				{/* Priority */}
				<button
					type="button"
					onClick={() => setShowPriority((prev) => !prev)}
					className="flex w-full items-center justify-between px-8 py-3 text-gray-500 "
				>
					<span className="">Priority</span>
					{showPriority ? (
						<ChevronUp className="h-5 w-5" />
					) : (
						<ChevronDown className="h-5 w-5" />
					)}
				</button>
				{/* Priority Links */}
				{showPriority && (
					<>
						<SidebarLink
							icon={AlertCircle}
							label="Urgent"
							href="/priority/urgent"
						/>
						<SidebarLink
							icon={ShieldAlert}
							label="High"
							href="/priority/high"
						/>
						<SidebarLink
							icon={AlertTriangle}
							label="Medium"
							href="/priority/medium"
						/>
						<SidebarLink icon={AlertOctagon} label="Low" href="/priority/low" />
						<SidebarLink
							icon={Layers3}
							label="Backlog"
							href="/priority/backlog"
						/>
					</>
				)}
			</div>
		</div>
	);
};

export default Sidebar;
