import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const Table = ({
	children,
	isEmpty = false,
	emptyStr = "No data available",
	showPagination = false,
	pagination = {
		limit: 10,
		page: 1,
		total: 0,
		setPage: () => { },
		setLimit: () => { },
	},
}: {
	children: React.ReactNode;
	isEmpty?: boolean;
	emptyStr?: string;
	showPagination?: boolean;
	pagination: {
		limit: number;
		page: number;
		total: number;
		setPage: (page: number) => void;
		setLimit: (limit: number) => void;
	}
}) => {
	return (
		<div className="relative border-2 dark:border-zinc-800 overflow-x-auto shadow-md sm:rounded-lg">
			<table className={`w-full ${showPagination && "border-b-2 dark:border-zinc-800"} text-md text-left rtl:text-right`}>
				{children}
			</table>
			{showPagination && <div className="flex flex-row items-center justify-end gap-10 whitespace-nowrap lg:text-lg border-b dark:border-zinc-800 bg-gray-100 dark:bg-dark-secondary">
				<div className="flex items-center justify-center gap-10 p-4">
					<div className="relative flex items-center space-x-2 border overflow-hidden rounded-lg ">
						<select
							id="rowsPerPage"
							value={pagination.limit}

							className="appearance-none bg-transparent pl-2 pr-6 h-10 rounded-lg dark:text-white focus:outline-none"
							onChange={(e) => pagination.setLimit(Number(e.target.value))}
						>
							<option value="10">10 per page</option>
							<option value="20">20 per page</option>
							<option value="30">30 per page</option>
							<option value="50">50 per page</option>
							<option value="100">100 per page</option>
						</select>
						<div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
							<span className="text-gray-500"><ChevronDown /></span>
						</div>
					</div>
					<div className="flex items-center justify-between gap-2 border rounded-lg pl-2  overflow-hidden">
						<div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
							Showing
							<span className="font-bold">
								{`${(pagination.page - 1) * pagination.limit + 1} - ${Math.min(pagination.page * pagination.limit, pagination.total)}`}
							</span>
							of {pagination.total}
						</div>
						<div className="border-l">
							<button
								type="button"
								className="p-1 hover:hover:bg-gray-300 dark:hover:bg-zinc-700 disabled:opacity-50"
								onClick={() => pagination.setPage(pagination.page - 1)}
								disabled={pagination.page === 1}
								aria-label="Previous Page"
							>
								<ChevronLeft />
							</button>
							<button
								type="button"
								className="p-1 hover:bg-gray-300 dark:hover:bg-zinc-700 disabled:opacity-50"
								onClick={() => pagination.setPage(pagination.page + 1)}
								disabled={pagination.page === (Math.ceil(pagination.total / pagination.limit))}
								aria-label="Next Page"
							>
								<ChevronRight />
							</button>
						</div>
					</div>
				</div>
				{isEmpty && <EmptyTable str={emptyStr} />}
			</div>}
		</div>
	);
};

const TableHeader = ({ children }: { children: React.ReactNode }) => {
	return (
		<thead className="text-xs uppercase border-b dark:border-zinc-800 bg-gray-100 dark:bg-dark-secondary">
			{children}
		</thead>
	);
};

const TableBody = ({ children }: { children: React.ReactNode }) => {
	return <tbody>{children}</tbody>;
};

const TableHead = ({ children }: { children: React.ReactNode }) => {
	return <th className="px-6 py-3 whitespace-nowrap">{children}</th>;
};

const TableRow = ({
	children,
	header,
	rowKey,
	index = 0,
}: {
	children: React.ReactNode;
	rowKey?: string | number;
	header?: boolean;
	index?: number;
}) => {
	return (
		<tr
			key={rowKey}
			className={
				header
					? ""
					: `${index % 2 === 0 ? "bg-gray-200 dark:bg-zinc-800" : "bg-gray-100 dark:bg-zinc-900"} hover:bg-gray-300 dark:hover:bg-zinc-700}`
			}
		>
			{children}
		</tr>
	);
};

const TableCell = ({ children }: { children: React.ReactNode }) => {
	return <td className="px-6 py-4 whitespace-nowrap w-max">{children}</td>;
};

const EmptyTable = ({ str = "No data available" }: { str?: string }) => {
	return (
		<div className="h-72 w-full flex items-center justify-center text-lg bg-grey-100 dark:bg-dark-secondary">
			{str}
		</div>
	);
};

export { Table, TableHeader, TableBody, TableHead, TableRow, TableCell };
