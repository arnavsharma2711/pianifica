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
	showPagination?: boolean;
	pagination?: {
		page: number;
		limit: number;
		total: number;
		setPage: React.Dispatch<React.SetStateAction<number>>;
		setLimit: React.Dispatch<React.SetStateAction<number>>;
	}
}

export function DataTable<T>({
	data,
	columns,
	withIndex = false,
	emptyStr = "No data available",
	actionHeader,
	action,
	showPagination = false,
	pagination = {
		page: 1,
		limit: 10,
		total: 10,
		setPage: () => { },
		setLimit: () => { },
	}
}: DataTableProps<T>) {
	const handlePageChange = (value: number) => {
		pagination.setPage(value);
	}
	const handleLimitChange = (value: number) => {
		pagination.setPage(1);
		pagination.setLimit(value);
	}
	return (
		<Table isEmpty={data.length === 0} emptyStr={emptyStr} showPagination={showPagination} pagination={{
			page: pagination.page,
			limit: pagination.limit,
			total: pagination.total,
			setPage: handlePageChange,
			setLimit: handleLimitChange,
		}
		}>
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
						{withIndex && <TableCell>{(pagination.page - 1) * pagination.limit + index + 1}</TableCell>}
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
