import { useLogout } from "@/api/auth/mutation";
import { SessionToken } from "@/common/auth/token";
import { Button, Title } from "@mantine/core";

export default function HomePage() {
  const { mutateAsync: logout, isPending } = useLogout();
  return <div>
    <Title order={1}>Hello world</Title>
    <Button loading={isPending} onClick={async () => {
      SessionToken.clear();
      await logout();
    }}>Logout</Button>
  </div>;
}
