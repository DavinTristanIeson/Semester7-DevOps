import AppLayout from "@/components/layout/app";
import DashboardNavigationBar from "@/components/layout/navbar";
import { Alert, Flex } from "@mantine/core";
import Colors from "@/common/constants/colors";
import { useRouter } from "next/router";
import NavigationRoutes from "@/common/constants/routes";
import { showNotification } from "@mantine/notifications";
import { SessionToken } from "@/common/auth/token";
import { useLogout } from "@/api/auth";
import React from "react";
import { WarningCircle } from "@phosphor-icons/react";
import { TaskContextProvider } from "@/modules/dashboard/components/context";
import ConfirmationDialog from "@/components/widgets/confirmation";
import { handleErrorFn } from "@/common/utils/form";
import { ToggleDispatcher } from "@/hooks/dispatch-action";
import { TaskFileUploadManager } from "@/modules/dashboard/components/upload";
import DashboardTable from "@/modules/dashboard/table";
import ExpressionRecognitionTaskStatusComponent from "@/modules/dashboard/task-status";

export default function DashboardPage() {
  const { mutateAsync: logout } = useLogout();
  const router = useRouter();
  const logoutConfirm = React.useRef<ToggleDispatcher | null>(null);
  const logoutAction = {
    label: "Logout",
    async onClick() {
      logoutConfirm.current?.open();
    },
  };
  return (
    <AppLayout Header={<DashboardNavigationBar links={[logoutAction]} />}>
      <ConfirmationDialog
        title="Logout"
        message="Are you sure you want to logout?"
        onConfirm={handleErrorFn(async () => {
          const res = await logout();
          if (res.message) {
            showNotification({
              message: res.message,
              color: Colors.sentimentInfo,
            });
          }
          router.replace(NavigationRoutes.Login);
          SessionToken.clear();
        })}
        dangerous
      />
      <TaskContextProvider>
        <div className="p-4">
          <TaskFileUploadManager />
          <ExpressionRecognitionTaskStatusComponent />
          <DashboardTable />
        </div>
      </TaskContextProvider>
    </AppLayout>
  );
}
