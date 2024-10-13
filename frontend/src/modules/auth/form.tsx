import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Flex, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "react-hook-form";
import { AuthFormType, AuthFormSchema } from "./form-type";
import SubmitButton from "@/components/standard/button/submit";
import FormWrapper from "@/components/utility/form/wrapper";
import capitalize from "lodash/capitalize";

interface AuthenticationFormProps {
  onSubmit(values: AuthFormType): void;
}

export default function AuthenticationForm(props: AuthenticationFormProps) {
  const { onSubmit } = props;
  const form = useForm({
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: yupResolver(AuthFormSchema()),
  });

  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <Flex direction={"column"} rowGap={16} w={400} m={20}>
        <TextInput
          {...form.register("username")}
          error={capitalize(form.formState.errors.username?.message)}
          label="Username"
          placeholder="Enter username"
          radius="xl"
        />
        <PasswordInput
          {...form.register("password")}
          error={capitalize(form.formState.errors.password?.message)}
          label="Password"
          placeholder="Enter password"
          style={{ marginBottom: "20px" }}
          radius="xl"
        />
        <Box h={20} />
        <SubmitButton>Submit</SubmitButton>
      </Flex>
    </FormWrapper>
  );
}
