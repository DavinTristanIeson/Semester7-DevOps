import { useState } from "react";
import Pagination, { usePaginateData } from "@/components/standard/pagination";
import { TaskFile, useTaskContext } from "./components/context";
import { ActionIcon, Flex, List, Table, Button } from "@mantine/core";
import Image from "next/image";
import {
  ExpressionRecognitionTaskResultModel,
  FacialExpressionProbabilities,
} from "@/api/task";
import DashboardStyles from "./dashboard.module.css";
import Text from "@/components/standard/text";
import { Eye } from "@phosphor-icons/react";

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
  // const flattenedFiles = files.flatMap((file) => {
  //   if (!file.results) {
  //     return [
  //       {
  //         file: file.file,
  //         url: file.url,
  //         result: null,
  //       },
  //     ];
  //   }
  //   return (file.results ?? []).map((result) => {
  //     return {
  //       file: file.file,
  //       url: file.url,
  //       result,
  //     } as DashboardTableType;
  //   });
  // });

  const flattenedFiles = [
    {
      file: "File1",
      url: "/images/Example1.jpeg",
      result: "Disgust",
    },
    {
      file: "File2",
      url: "/images/Example1.jpeg",
      result: "angry",
    },
    {
      file: "File3",
      url: "/images/Register.jpg",
      result: "sad",
    },
    {
      file: "File4",
      url: "/images/Example2.png",
      result: "Angry",
    },
    {
      file: "File5",
      url: "/images/Login.jpg",
      result: "Happy",
    },
    {
      file: "File6",
      url: "/images/Register.jpg",
      result: "happy",
    },
    {
      file: "File7",
      url: "/images/Example2.png",
      result: "sad",
    },
    {
      file: "File8",
      url: "/images/Example1.jpeg",
      result: "Happy",
    },
    {
      file: "File9",
      url: "/images/Register.jpg",
      result: "Happy",
    },
    {
      file: "File10",
      url: "/images/Example2.png",
      result: "neutral",
    },
    {
      file: "File10",
      url: "/images/Login.jpg",
      result: "Surprised",
    },
  ];

  const [filter, setFilter] = useState<string | null>(null);

  const filteredFiles = filter
    ? flattenedFiles.filter((file) => file.result.toLowerCase() === filter)
    : flattenedFiles;

  const handleFilterClick = (expression: string) => {
    setFilter(expression.toLowerCase());
  };

  const { data, meta, from, pagination } = usePaginateData(filteredFiles);

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
      <List className={DashboardStyles["list"]}>
        {["Happy", "Sad", "Angry", "Disgust", "Neutral", "Surprised"].map(
          (expression) => (
            <Button
              key={expression}
              variant="default"
              className={DashboardStyles["filter-button"]}
              onClick={() => handleFilterClick(expression)}
              onDoubleClick={() => setFilter(null)}
            >
              {expression}
            </Button>
          )
        )}
      </List>
      <Table
        style={{
          minWidth: "100%",
          backgroundColor: "white",
          border: "1px solid #E5E7EB",
          borderRadius: "0.5rem",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Table.Thead>
          <Table.Tr
            style={{
              backgroundColor: "#F3F4F6",
              borderBottom: "1px solid #D1D5DB",
            }}
          >
            <Table.Th
              style={{
                padding: "1rem 1.5rem",
                textAlign: "left",
                fontSize: "1rem",
                fontWeight: "600",
                color: "#4B5563",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Index
            </Table.Th>
            <Table.Th
              style={{
                padding: "1rem 1.5rem",
                textAlign: "left",
                fontSize: "1rem",
                fontWeight: "600",
                color: "#4B5563",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Image
            </Table.Th>
            <Table.Th
              style={{
                padding: "1rem 1.5rem",
                textAlign: "left",
                fontSize: "1rem",
                fontWeight: "600",
                color: "#4B5563",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              File Name
            </Table.Th>
            <Table.Th
              style={{
                padding: "1rem 1.5rem",
                textAlign: "left",
                fontSize: "1rem",
                fontWeight: "600",
                color: "#4B5563",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Expression
            </Table.Th>
            <Table.Th
              style={{
                padding: "1rem 1.5rem",
                textAlign: "left",
                fontSize: "1rem",
                fontWeight: "600",
                color: "#4B5563",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Action
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map((item, index) => {
            return (
              <Table.Tr
                style={{
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  backgroundColor: "transparent",
                }}
              >
                <Table.Td
                  style={{
                    padding: "0.5rem 1.5rem",
                    whiteSpace: "nowrap",
                    fontSize: "1.3rem",
                    color: "#111827",
                    verticalAlign: "middle",
                  }}
                >
                  {from + index + 1}
                </Table.Td>
                <Table.Td
                  style={{
                    padding: "0.5rem 1.5rem",
                    whiteSpace: "nowrap",
                    verticalAlign: "middle",
                  }}
                >
                  <NextImage
                    src={item.url}
                    alt={item.file}
                    width={96}
                    height={96}
                    style={{
                      width: "4rem",
                      height: "4rem",
                      borderRadius: "0.375rem",
                      objectFit: "cover",
                    }}
                  />
                </Table.Td>
                <Table.Td
                  style={{
                    padding: "0.5rem 1.5rem",
                    whiteSpace: "nowrap",
                    fontSize: "1.3rem",
                    color: "#111827",
                    verticalAlign: "middle",
                  }}
                >
                  {item.file}
                </Table.Td>
                <Table.Td
                  style={{
                    padding: "0.5rem 1.5rem",
                    whiteSpace: "nowrap",
                    fontSize: "1.3rem",
                    color: "#111827",
                    verticalAlign: "middle",
                  }}
                >
                  {item.result}
                </Table.Td>
                <Table.Td
                  style={{
                    padding: "0.5rem 1.5rem",
                    whiteSpace: "nowrap",
                    fontSize: "1.3rem",
                    color: "#111827",
                    verticalAlign: "middle",
                  }}
                >
                  <ActionIcon>
                    <Eye />
                  </ActionIcon>
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
