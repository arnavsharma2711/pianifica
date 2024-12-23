import type React from "react";

const Loading: React.FC = () => {
	return (
		<output className="w-full animate-pulse p-10">
			<div className="flex flex-row items-center justify-between mb-10">
				<div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-8" />
				<div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-28 mb-8" />
			</div>
			<div className="flex flex-col gap-4">
				<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700" />
				<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mr-10" />
				<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700" />
				<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mr-52" />
				<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mr-40" />
				<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700" />
				<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mr-10" />
				<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700" />
				<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mr-52" />
				<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mr-40" />
				<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700" />
				<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mr-10" />
				<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700" />
				<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mr-52" />
				<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mr-40" />
			</div>
			<span className="sr-only">Loading...</span>
		</output>
	);
};

export default Loading;
