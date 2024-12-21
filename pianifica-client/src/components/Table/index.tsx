const Table = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="relative border-2 dark:border-zinc-800 overflow-x-auto shadow-md sm:rounded-lg">
			<table className="w-full text-md text-left rtl:text-right">
				{children}
			</table>
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
	return <td className="px-6 py-4 whitespace-nowrap">{children}</td>;
};

export { Table, TableHeader, TableBody, TableHead, TableRow, TableCell };