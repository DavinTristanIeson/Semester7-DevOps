import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { AlbumFormSchema, AlbumFormType } from "./form-type";
import React from "react";
import { Box, TextInput } from "@mantine/core";
import FormWrapper from "@/components/utility/form/wrapper";
import SubmitButton from "@/components/standard/button/submit";

interface AlbumFormProps {
  onSubmit(payload: AlbumFormType): Promise<void>;
}

export default function AlbumForm(props: AlbumFormProps) {
  const form = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
    },
    resolver: yupResolver(AlbumFormSchema()),
  });
  return (
    <FormWrapper form={form} onSubmit={props.onSubmit}>
      <TextInput
        {...form.register("name")}
        label="Name"
        placeholder="The name of your album"
      />
      <Box h={16} />
      <SubmitButton fullWidth>Create</SubmitButton>
    </FormWrapper>
  );
}
