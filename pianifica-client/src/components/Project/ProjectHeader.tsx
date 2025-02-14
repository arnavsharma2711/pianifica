import type React from "react";
import Header from "@/components/Header";
import {
	Bookmark,
	BookmarkCheck,
	Clock,
	Filter,
	Grid3X3,
	List,
	LoaderCircle,
	Share2,
	Table2Icon,
} from "lucide-react";
import { useAddBookmarkProjectMutation, useRemoveBookmarkProjectMutation } from "@/state/api";

type TabButtonProps = {
	tabName: string;
	icon: React.ReactNode;
	activeTab: string;
	setActiveTab: (tabName: string) => void;
};

const TabButton = ({
	tabName,
	icon,
	activeTab,
	setActiveTab,
}: TabButtonProps) => {
	const isActive = activeTab === tabName;

	return (
		<button
			type="button"
			className={`${isActive
				? "text-blue-600 after:bg-blue-600 dark:text-white font-bold"
				: ""
				} relative flex items-center gap-2 px-1 py-2 text-gray-500 after:absolute after:-bottom-[9px] after:left-0 after:h-[1px] after:w-full hover:text-blue-600 dark:text-neutral-500 dark:hover:text-white sm:px-2 lg:px-4`}
			onClick={() => setActiveTab(tabName)}
		>
			{icon}
			{tabName}
		</button>
	);
};
type Props = {
	projectName: string;
	projectId: number;
	isBookmarked: boolean;
	activeTab: string;
	setActiveTab: (tabName: string) => void;
};

const ProjectHeader = ({
	projectName = "Project Board",
	projectId,
	isBookmarked = false,
	activeTab,
	setActiveTab,
}: Props) => {
	const [addBookmark, { isLoading: addingBookmark }] = useAddBookmarkProjectMutation();
	const [removeBookmark, { isLoading: removingBookmark }] = useRemoveBookmarkProjectMutation();

	const handleBookmark = async (isBookmarked: boolean) => {
		if (isBookmarked) {
			await removeBookmark({ projectId });
		} else {
			await addBookmark({ projectId });
		}
	}

	return (
		<div className="px-4 xl:px-6">
			<div className="pb-6 pt-2 lg:pb-4">
				<Header
					name={projectName}
					buttonComponent={
						<button
							type="button"
							className="flex items-center rounded-md p-2"
							onClick={() => handleBookmark(isBookmarked)}
							disabled={addingBookmark || removingBookmark}
						>
							{
								addingBookmark || removingBookmark ? (
									<LoaderCircle />
								) : (
									isBookmarked ? (
										<BookmarkCheck />
									) : (
										<Bookmark />
									)
								)
							}
						</button>
					}
				/>
			</div>
			{/* TABS */}
			<div className="flex flex-wrap-reverse gap-2 border-y border-gray-200 pb-[8px] pt-2 dark:border-stroke-dark md:items-center">
				<div className="flex flex-1 items-center gap-2 md:gap-4">
					<TabButton
						tabName="Board"
						icon={<Grid3X3 className="w-5 h-5" />}
						activeTab={activeTab}
						setActiveTab={setActiveTab}
					/>
					<TabButton
						tabName="List"
						icon={<List className="w-5 h-5" />}
						activeTab={activeTab}
						setActiveTab={setActiveTab}
					/>
					<TabButton
						tabName="Timeline"
						icon={<Clock className="w-5 h-5" />}
						activeTab={activeTab}
						setActiveTab={setActiveTab}
					/>
					<TabButton
						tabName="Table"
						icon={<Table2Icon className="w-5 h-5" />}
						activeTab={activeTab}
						setActiveTab={setActiveTab}
					/>
				</div>
				<div className="flex items-center gap-2">
					<button
						type="button"
						className="text-gray-500 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-gray-300"
					>
						<Filter className="w-5 h-5" />
					</button>
					<button
						type="button"
						className="text-gray-500 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-gray-300"
					>
						<Share2 className="w-5 h-5" />
					</button>
					<div className="relative">
						<input
							type="text"
							className="rounded-md border py-1 pl-8 pr-4 focus:outline-none dark:outline-none dark:border-dark-secondary dark:bg-dark-secondary"
							placeholder="Search Task"
						/>
						<Grid3X3 className="h-4 w-4 absolute left-3 top-2 text-gray-400 dark:text-neutral-500" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProjectHeader;
