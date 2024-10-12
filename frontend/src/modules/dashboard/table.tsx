import Pagination, { usePaginateData } from "@/components/standard/pagination";
import { TaskFile, useTaskContext } from "./components/context";
import { Flex, Table } from "@mantine/core";
import Image from "next/image";
import { ExpressionRecognitionTaskResultModel } from "@/api/task";
import DashboardStyles from "./dashboard.module.css";
import Text from "@/components/standard/text";

type DashboardTableType = Omit<TaskFile, "results"> & {
  result: ExpressionRecognitionTaskResultModel | null;
};

export default function DashboardTable() {
  const { files } = useTaskContext();
  const flattenedFiles = files.flatMap((file) => {
    if (!file.results) {
      return [
        {
          file: file.file,
          url: file.url,
          result: null,
        },
      ];
    }
    return (file.results ?? []).map((result) => {
      return {
        file: file.file,
        url: file.url,
        result,
      } as DashboardTableType;
    });
  });
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
          Oops, it looks like you haven't uploaded any files to our service at
          the moment.
        </Text>
        <Text ta="center">
          Why don't you give it a try by adding a few images to the area above?
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
              <Table.Tr>
                <Table.Td>{from + index}</Table.Td>
                <Table.Td>
                  <Image
                    src={item.url}
                    alt={item.file.name}
                    width={96}
                    height={96}
                  />
                </Table.Td>
                <Table.Td>{item.file.name}</Table.Td>
                <Table.Td>{item.result?.probabilities.classify()}</Table.Td>
                {/* <Table.Td>
                  <ActionIcon>
                    <Eye />
                  </ActionIcon>
                </Table.Td> */}
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
      <Pagination meta={meta} {...pagination} />
    </>
  );
}
