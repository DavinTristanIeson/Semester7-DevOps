import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Flex, PasswordInput, TextInput } from "@mantine/core";
import { Controller, Form, useForm } from "react-hook-form";
import { AuthFormType, AuthFormSchema } from "./form-type";
import { showNotification } from "@mantine/notifications";
import { handleFormSubmission } from "@/common/utils/form";
import FormStyles from "@/styles/form.module.css";

interface AuthenticationFormProps {
  onSubmit(values: AuthFormType): void;
}

export default function AuthenticationForm(props: AuthenticationFormProps) {
  const { onSubmit } = props;
  const form = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(AuthFormSchema()),
  });

  const handleSubmit = handleFormSubmission(onSubmit, form);

  return (
    <Form control={form.control} onSubmit={handleSubmit} className={FormStyles["form-box"]}>
      <Flex direction={"column"} rowGap={16}>
        <TextInput
          {...form.register("email")}
          error={form.formState.errors.email?.message}
          label="Email"
          placeholder="Enter email"
        />
        <PasswordInput
          {...form.register("password")}
          error={form.formState.errors.password?.message}
          label="Password"
          placeholder="Enter password"
          style={{ marginBottom: "20px" }}
        />
        <Button fullWidth type="submit" className={FormStyles["button"]}>
          Submit
        </Button>
      </Flex>
    </Form>
  );
}
