import { ExpressionRecognitionTaskResultModel } from "@/api/task";
import { useSessionStorage } from "@mantine/hooks";
import React from "react";

export interface TaskFile {
  file: File;
  url: string;
  results: ExpressionRecognitionTaskResultModel[] | null;
}

interface TaskContextType {
  taskId: string | undefined;
  setTaskId: React.Dispatch<React.SetStateAction<string | undefined>>;
  files: TaskFile[];
  setFiles: React.Dispatch<React.SetStateAction<TaskFile[]>>;
}

const TaskContext = React.createContext<TaskContextType>(undefined as any);

export function TaskContextProvider(props: React.PropsWithChildren) {
  const [taskId, setTaskId] = React.useState<string | undefined>(undefined);
  const [files, setFiles] = React.useState<TaskFile[]>([]);
  return (
    <TaskContext.Provider
      value={{
        taskId,
        setTaskId,
        files,
        setFiles,
      }}
    >
      {props.children}
    </TaskContext.Provider>
  );
}

type UseTaskContextReturn = Omit<TaskContextType, "files" | "setFiles"> & {
  files: TaskFile[];
  setFiles(file: File[]): void;
};

export function useTaskContext(): UseTaskContextReturn {
  const { files, setFiles, taskId, setTaskId } = React.useContext(TaskContext);

  return {
    taskId,
    setTaskId,
    files,
    setFiles(files: File[]) {
      const taskfiles = files.map((file) => {
        return {
          file,
          url: URL.createObjectURL(file),
          results: null,
        };
      });
      setFiles(taskfiles);
    },
  };
}
