import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Flex, PasswordInput, TextInput } from "@mantine/core";
import { Form, FormProvider, useForm } from "react-hook-form";
import { AuthFormType, AuthFormSchema } from "./form-type";
import { handleFormSubmission } from "@/common/utils/form";
import AuthStyles from './auth.module.css';
import Button from "@/components/standard/button/base";
import SubmitButton from "@/components/standard/button/submit";
import FormWrapper from "@/components/utility/form/wrapper";

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

  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <Flex direction={"column"} rowGap={16} w={400} m={20}>
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
        <Box h={20} />
        <SubmitButton>
          Submit
        </SubmitButton>
      </Flex>
    </FormWrapper>
  );
}
