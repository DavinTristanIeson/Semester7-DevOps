import { useState } from "react";
import Pagination, { usePaginateData } from "@/components/standard/pagination";
import { TaskFile, useTaskContext } from "./components/context";
import { Flex, List, Table, Button, Badge } from "@mantine/core";
import {
  ExpressionRecognitionTaskResultModel,
  FacialExpression,
  FacialExpressionProbabilities,
} from "@/api/task";
import DashboardStyles from "./dashboard.module.css";
import Text from "@/components/standard/text";
import Image from "next/image";
import React from "react";
import { classNames } from "@/common/utils/styles";
import Colors from "@/common/constants/colors";

type DashboardTableType = Omit<TaskFile, "results"> & {
  id: string;
  result: ExpressionRecognitionTaskResultModel | null;
};

export default function DashboardTable() {
  const { files, setFiles, setStagedFiles } = useTaskContext();
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

  const [filter, setFilter] = useState<FacialExpression | null>(null);

  const filteredFiles = filter
    ? flattenedFiles.filter((file) =>
      file.result
        ? FacialExpressionProbabilities.classify(
          file.result.probabilities
        ) === filter
        : false
    )
    : flattenedFiles;

  const handleFilterClick = (expression: FacialExpression) => {
    setFilter((filter) => {
      if (filter === expression) {
        return null;
      }
      return expression;
    });
  };
  const handleResetClick = () => {
    setFiles([]);
    setStagedFiles([]);
    setFilter(null);
    setPage(1);
  };

  const expressionSums = React.useMemo(() => {
    const sums: Record<FacialExpression, number> = {
      [FacialExpression.Angry]: 0,
      [FacialExpression.Disgusted]: 0,
      [FacialExpression.Happy]: 0,
      [FacialExpression.Neutral]: 0,
      [FacialExpression.Sad]: 0,
      [FacialExpression.Surprised]: 0,
    };

    for (const file of flattenedFiles) {
      if (!file.result) continue;
      const classifiication = FacialExpressionProbabilities.classify(
        file.result.probabilities
      );
      sums[classifiication] += 1;
    }
    return sums;
  }, [flattenedFiles]);

  const { data, meta, from, pagination } = usePaginateData(filteredFiles);
  const { setPage } = pagination;

  React.useEffect(() => {
    setFilter(null);
    setPage(1);
  }, [files, setPage]);

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
        {[
          FacialExpression.Angry,
          FacialExpression.Disgusted,
          FacialExpression.Happy,
          FacialExpression.Neutral,
          FacialExpression.Sad,
          FacialExpression.Surprised,
        ].map((expression) => (
          <Button
            key={expression}
            variant="default"
            className={classNames(
              DashboardStyles["filter-button"],
              expression === filter
                ? DashboardStyles["filter-button--active"]
                : undefined
            )}
            onClick={() => handleFilterClick(expression)}
            tt="capitalize"
          >
            {expression}
            {expressionSums[expression] ? (
              <Badge color={Colors.sentimentSuccess} ml={8}>
                {expressionSums[expression]}
              </Badge>
            ) : undefined}
          </Button>

        ))}
        <Button
          variant="default"
          className={DashboardStyles["reset-button"]}
          onClick={handleResetClick}
        >
          Reset
        </Button>
      </List>
      <Table className={DashboardStyles["table__root"]}>
        <Table.Thead>
          <Table.Tr className={DashboardStyles["table__header__row"]}>
            <Table.Th className={DashboardStyles["table__header__cell"]}>
              Index
            </Table.Th>
            <Table.Th className={DashboardStyles["table__header__cell"]}>
              Image
            </Table.Th>
            <Table.Th className={DashboardStyles["table__header__cell"]}>
              File Name
            </Table.Th>
            <Table.Th className={DashboardStyles["table__header__cell"]}>
              Expression
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map((item, index) => {
            return (
              <Table.Tr
                className={DashboardStyles["table__body__row"]}
                key={item.id}
              >
                <Table.Td className={DashboardStyles["table__body__cell"]}>
                  {from + index + 1}
                </Table.Td>
                <Table.Td
                  className={
                    DashboardStyles["table__body__cell__image__container"]
                  }
                >
                  <Image
                    src={item.url}
                    alt={item.file.name}
                    width={96}
                    height={96}
                    className={DashboardStyles["table__body__cell__image"]}
                  />
                </Table.Td>
                <Table.Td className={DashboardStyles["table__body__cell"]}>
                  {item.file.name}
                </Table.Td>
                <Table.Td
                  className={DashboardStyles["table__body__cell"]}
                  tt="capitalize"
                >
                  {item.result?.probabilities
                    ? FacialExpressionProbabilities.classify(
                      item.result.probabilities
                    )
                    : null}
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
