import { PaginationMeta } from "@/common/api/model";
import { Pagination as RawPagination, Select } from "@mantine/core";
import React from "react";

interface PaginationSetupProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  size: number;
  setSize: React.Dispatch<React.SetStateAction<number>>;
}

export function usePaginationSetup() {
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(15);
  return { page, setPage, size, setSize };
}

interface PaginationProps extends PaginationSetupProps {
  meta: PaginationMeta;
}

export default function Pagination(props: PaginationProps) {
  return (
    <RawPagination
      total={props.meta.pages}
      value={props.page - 1}
      onChange={props.setPage}
      p={16}
    />
  );
}
