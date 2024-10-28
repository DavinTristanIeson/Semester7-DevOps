import Pagination, { usePaginateData } from "@/components/standard/pagination";
import { TaskFile, useTaskContext } from "./components/context";
import { Flex, Table } from "@mantine/core";
import NextImage from "next/image";
import {
  ExpressionRecognitionTaskResultModel,
  FacialExpressionProbabilities,
} from "@/api/task";
import DashboardStyles from "./dashboard.module.css";
import Text from "@/components/standard/text";
import React from "react";

type DashboardTableType = Omit<TaskFile, "results"> & {
  id: string;
  result: ExpressionRecognitionTaskResultModel | null;
};

export default function DashboardTable() {
  const { files } = useTaskContext();
  const flattenedFiles = React.useMemo(() => {
    return files.flatMap((file) => {
      if (!file.results) {
        return [
          {
            id: file.file.name,
            file: file.file,
            url: file.url,
            result: null,
          },
        ];
      }
      return (file.results ?? []).map((result) => {
        return {
          id: result.id,
          file: file.file,
          url: file.url,
          result,
        } as DashboardTableType;
      });
    });
  }, [files]);
  const { data, meta, from, pagination } = usePaginateData(flattenedFiles);

  if (flattenedFiles.length === 0) {
    return (
      <Flex
        className={DashboardStyles["empty-view"]}
        align="center"
        justify="center"
        direction="column"
      >
        <Text ta="center" size="xl">
          Oops, it looks like you haven&apos;t uploaded any files to our service
          at the moment.
        </Text>
        <Text ta="center">
          Why don&apos;t you give it a try by adding a few images to the area
          above?
        </Text>
      </Flex>
    );
  }

  return (
    <>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Index</Table.Th>
            <Table.Th>Image</Table.Th>
            <Table.Th>File Name</Table.Th>
            <Table.Th>Expression</Table.Th>
            {/* <Table.Th>Action</Table.Th> */}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map((item, index) => {
            return (
              <Table.Tr key={item.id}>
                <Table.Td>{from + index + 1}</Table.Td>
                <Table.Td>
                  <NextImage
                    src={item.url}
                    alt={item.file.name}
                    width={96}
                    height={96}
                  />
                </Table.Td>
                <Table.Td>{item.file.name}</Table.Td>
                <Table.Td>
                  {item.result?.probabilities &&
                    FacialExpressionProbabilities.classify(
                      item.result?.probabilities
                    )}
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
      <Pagination meta={meta} {...pagination} />
    </>
  );
}
