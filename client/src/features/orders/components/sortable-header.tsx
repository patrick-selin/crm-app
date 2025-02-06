import { Table } from "@mantine/core";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import styles from "./sortable-header.module.css";

interface SortableHeaderProps {
  column: string;
  label: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (column: string) => void;
}

export const SortableHeader: React.FC<SortableHeaderProps> = ({
  column,
  label,
  sortBy,
  sortOrder,
  onSort,
}) => {
  const isSorted = sortBy === column;
  const SortIcon = isSorted
    ? sortOrder === "asc"
      ? ChevronUpIcon
      : ChevronDownIcon
    : ChevronUpDownIcon;

  return (
    <Table.Th onClick={() => onSort(column)}>
      <span className={styles["sortable-header"]}>
        {label} <SortIcon />
      </span>
    </Table.Th>
  );
};
