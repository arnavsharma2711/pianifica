import type * as React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/Table";

interface DataTableProps<T> {
	data: T[];
	columns: {
		header: string;
		accessorKey: keyof T;
		cell?: (item: T) => React.ReactNode;
	}[];
	withIndex?: boolean;
	emptyStr?: string;
	actionHeader?: string;
	action?: (item: T) => React.ReactNode;
}

export function DataTable<T>({
	data,
	columns,
	withIndex = false,
	emptyStr = "No data available",
	actionHeader,
	action,
}: DataTableProps<T>) {
	return (
		<Table isEmpty={data.length === 0} emptyStr={emptyStr}>
			<TableHeader>
				<TableRow header={true}>
					{withIndex && <TableHead>S. No.</TableHead>}
					{columns.map((column) => (
						<TableHead key={column.accessorKey as string}>
							{column.header}
						</TableHead>
					))}
					{actionHeader && <TableHead>{actionHeader}</TableHead>}
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.map((item, index) => (
					<TableRow key={item[columns[0].accessorKey] as string} index={index}>
						{withIndex && <TableCell>{index + 1}</TableCell>}
						{columns.map((column) => (
							<TableCell key={column.accessorKey as string}>
								{column.cell
									? column.cell(item)
									: (item[column.accessorKey] as React.ReactNode)}
							</TableCell>
						))}
						{actionHeader && <TableCell>{action?.(item)}</TableCell>}
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
