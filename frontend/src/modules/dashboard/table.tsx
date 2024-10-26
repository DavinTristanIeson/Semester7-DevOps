import Pagination, { usePaginateData } from "@/components/standard/pagination";
import { TaskFile, useTaskContext } from "./components/context";
import { ActionIcon, Flex, Table } from "@mantine/core";
import Image from "next/image";
import {
  ExpressionRecognitionTaskResultModel,
  FacialExpressionProbabilities,
} from "@/api/task";
import DashboardStyles from "./dashboard.module.css";
import Text from "@/components/standard/text";
import { Eye } from "@phosphor-icons/react";

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
      // <Flex
      //   className={DashboardStyles["empty-view"]}
      //   align="center"
      //   justify="center"
      //   direction="column"
      // >
      //   <Text ta="center" size="xl">
      //     Oops, it looks like you haven't uploaded any files to our service at
      //     the moment.
      //   </Text>
      //   <Text ta="center">
      //     Why don't you give it a try by adding a few images to the area above?
      //   </Text>
      // </Flex>
      <>
        <Table style={{ minWidth: '100%', backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
          <Table.Thead>
            <Table.Tr style={{ backgroundColor: '#F3F4F6', borderBottom: '1px solid #D1D5DB' }}>
              <Table.Th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '1rem', fontWeight: '600', color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Index
              </Table.Th>
              <Table.Th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '1rem', fontWeight: '600', color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Image
              </Table.Th>
              <Table.Th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '1rem', fontWeight: '600', color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                File Name
              </Table.Th>
              <Table.Th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '1rem', fontWeight: '600', color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Expression
              </Table.Th>
              <Table.Th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '1rem', fontWeight: '600', color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Action
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr style={{ cursor: 'pointer', transition: 'background-color 0.2s', backgroundColor: 'transparent' }}>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                1
              </Table.Td>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                <Image
                  src={"/images/Example1.jpeg"}
                  alt={"login image"}
                  width={100}
                  height={100}
                  style={{ width: '3.5rem', height: '3.5rem', borderRadius: '0.375rem', objectFit: 'cover' }}
                />
              </Table.Td>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                image 1
              </Table.Td>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                sad
              </Table.Td>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                <ActionIcon style={{ color: '#3B82F6', transition: 'color 0.2s' }}>
                  <Eye />
                </ActionIcon>
              </Table.Td>
            </Table.Tr>
            <Table.Tr style={{ cursor: 'pointer', transition: 'background-color 0.2s', backgroundColor: 'transparent' }}>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                2
              </Table.Td>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                <Image
                  src={"/images/Example2.png"}
                  alt={"login image"}
                  width={100}
                  height={100}
                  style={{ width: '3.5rem', height: '3.5rem', borderRadius: '0.375rem', objectFit: 'cover' }}
                />
              </Table.Td>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                image 2
              </Table.Td>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                angry
              </Table.Td>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                <ActionIcon style={{ color: '#3B82F6', transition: 'color 0.2s' }}>
                  <Eye />
                </ActionIcon>
              </Table.Td>
            </Table.Tr>
            <Table.Tr style={{ cursor: 'pointer', transition: 'background-color 0.2s', backgroundColor: 'transparent' }}>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                3
              </Table.Td>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                <Image
                  src={"/images/Register.jpg"}
                  alt={"login image"}
                  width={100}
                  height={100}
                  style={{ width: '3.5rem', height: '3.5rem', borderRadius: '0.375rem', objectFit: 'cover' }}
                />
              </Table.Td>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                image 3
              </Table.Td>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                happy
              </Table.Td>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                <ActionIcon style={{ color: '#3B82F6', transition: 'color 0.2s' }}>
                  <Eye />
                </ActionIcon>
              </Table.Td>
            </Table.Tr>
            <Table.Tr style={{ cursor: 'pointer', transition: 'background-color 0.2s', backgroundColor: 'transparent' }}>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                4
              </Table.Td>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                <Image
                  src={"/images/Login.jpg"}
                  alt={"login image"}
                  width={100}
                  height={100}
                  style={{ width: '3.5rem', height: '3.5rem', borderRadius: '0.375rem', objectFit: 'cover' }}
                />
              </Table.Td>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                image 4
              </Table.Td>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                disgust
              </Table.Td>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                <ActionIcon style={{ color: '#3B82F6', transition: 'color 0.2s' }}>
                  <Eye />
                </ActionIcon>
              </Table.Td>
            </Table.Tr>
            <Table.Tr style={{ cursor: 'pointer', transition: 'background-color 0.2s', backgroundColor: 'transparent' }}>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                5
              </Table.Td>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                <Image
                  src={"/images/Example1.jpeg"}
                  alt={"login image"}
                  width={100}
                  height={100}
                  style={{ width: '3.5rem', height: '3.5rem', borderRadius: '0.375rem', objectFit: 'cover' }}
                />
              </Table.Td>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                image 5
              </Table.Td>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                angry
              </Table.Td>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                <ActionIcon style={{ color: '#3B82F6', transition: 'color 0.2s' }}>
                  <Eye />
                </ActionIcon>
              </Table.Td>
            </Table.Tr>
            <Table.Tr style={{ cursor: 'pointer', transition: 'background-color 0.2s', backgroundColor: 'transparent' }}>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                6
              </Table.Td>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                <Image
                  src={"/images/Register.jpg"}
                  alt={"login image"}
                  width={100}
                  height={100}
                  style={{ width: '3.5rem', height: '3.5rem', borderRadius: '0.375rem', objectFit: 'cover' }}
                />
              </Table.Td>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                image 6
              </Table.Td>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                disgust
              </Table.Td>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                <ActionIcon style={{ color: '#3B82F6', transition: 'color 0.2s' }}>
                  <Eye />
                </ActionIcon>
              </Table.Td>
            </Table.Tr>
            <Table.Tr style={{ cursor: 'pointer', transition: 'background-color 0.2s', backgroundColor: 'transparent' }}>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                7
              </Table.Td>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                <Image
                  src={"/images/Example2.png"}
                  alt={"login image"}
                  width={100}
                  height={100}
                  style={{ width: '3.5rem', height: '3.5rem', borderRadius: '0.375rem', objectFit: 'cover' }}
                />
              </Table.Td>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                image 7
              </Table.Td>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                happy
              </Table.Td>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                <ActionIcon style={{ color: '#3B82F6', transition: 'color 0.2s' }}>
                  <Eye />
                </ActionIcon>
              </Table.Td>
            </Table.Tr>
            <Table.Tr style={{ cursor: 'pointer', transition: 'background-color 0.2s', backgroundColor: 'transparent' }}>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                8
              </Table.Td>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                <Image
                  src={"/images/Example1.jpeg"}
                  alt={"login image"}
                  width={100}
                  height={100}
                  style={{ width: '3.5rem', height: '3.5rem', borderRadius: '0.375rem', objectFit: 'cover' }}
                />
              </Table.Td>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                image 8
              </Table.Td>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                sad
              </Table.Td>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                <ActionIcon style={{ color: '#3B82F6', transition: 'color 0.2s' }}>
                  <Eye />
                </ActionIcon>
              </Table.Td>
            </Table.Tr>
            <Table.Tr style={{ cursor: 'pointer', transition: 'background-color 0.2s', backgroundColor: 'transparent' }}>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                9
              </Table.Td>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                <Image
                  src={"/images/Login.jpg"}
                  alt={"login image"}
                  width={100}
                  height={100}
                  style={{ width: '3.5rem', height: '3.5rem', borderRadius: '0.375rem', objectFit: 'cover' }}
                />
              </Table.Td>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                image 9
              </Table.Td>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                happy
              </Table.Td>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                <ActionIcon style={{ color: '#3B82F6', transition: 'color 0.2s' }}>
                  <Eye />
                </ActionIcon>
              </Table.Td>
            </Table.Tr>
            <Table.Tr style={{ cursor: 'pointer', transition: 'background-color 0.2s', backgroundColor: 'transparent' }}>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                10
              </Table.Td>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                <Image
                  src={"/images/Example1.jpeg"}
                  alt={"login image"}
                  width={100}
                  height={100}
                  style={{ width: '3.5rem', height: '3.5rem', borderRadius: '0.375rem', objectFit: 'cover' }}
                />
              </Table.Td>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                image 10
              </Table.Td>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                sad
              </Table.Td>
              <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                <ActionIcon style={{ color: '#3B82F6', transition: 'color 0.2s' }}>
                  <Eye />
                </ActionIcon>
              </Table.Td>
            </Table.Tr>
            {data.map((item, index) => {
              return (
                <Table.Tr key={index} style={{ cursor: 'pointer', transition: 'background-color 0.2s', backgroundColor: 'transparent' }}>
                  <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                    {from + index + 1}
                  </Table.Td>
                  <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                    <Image
                      src={item.url}
                      alt={item.file.name}
                      width={96}
                      height={96}
                      style={{ width: '3.5rem', height: '3.5rem', borderRadius: '0.375rem', objectFit: 'cover' }}
                    />
                  </Table.Td>
                  <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                    {item.file.name}
                  </Table.Td>
                  <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                    {item.result?.probabilities &&
                      FacialExpressionProbabilities.classify(
                        item.result?.probabilities
                      )}
                  </Table.Td>
                  <Table.Td style={{ padding: '0.5rem 1.5rem', whiteSpace: 'nowrap', fontSize: '1.3rem', color: '#111827', verticalAlign: 'middle' }}>
                    <ActionIcon style={{ color: '#3B82F6', transition: 'color 0.2s' }}>
                      <Eye />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
        <div style={{ marginTop: '1rem' }}>
          <Pagination meta={meta} {...pagination} />
        </div>
      </>


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
                <Table.Td>{from + index + 1}</Table.Td>
                <Table.Td>
                  <Image
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
