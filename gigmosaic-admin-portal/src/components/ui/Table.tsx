import React from "react";
import {
  Table as HeroTable,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

interface Column {
  key: string;
  label: string;
}

interface TableProps {
  columns: Column[];
  data: any[];
  emptyContent?: string;
  className?: string;
  children?: React.ReactNode;
}

const Table: React.FC<TableProps> = ({
  columns,
  data,
  emptyContent = "No data to display",
  className = "",
  children,
}) => {
  return (
    <HeroTable
      aria-label="Data Table"
      selectionMode="single"
      color="success"
      isStriped
      shadow="none"
      className={className}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.key}
            className="bg-gray-500 text-white font-bold uppercase"
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={emptyContent}>{children}</TableBody>
    </HeroTable>
  );
};

export default Table;
