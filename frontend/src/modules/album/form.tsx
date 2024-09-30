import { yupResolver } from "@hookform/resolvers/yup";
import { Form, useForm } from "react-hook-form";
import { AlbumFormSchema, AlbumFormType } from "./form-type";
import React from "react";
import { handleFormSubmission } from "@/common/utils/form";
import { Button } from "@mantine/core";

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
  const handleSubmit = handleFormSubmission(props.onSubmit, form);
  return (
    <Form control={form.control} onSubmit={handleSubmit}>
      {/* TODO */}
      <Button type="submit">Create</Button>
    </Form>
  );
}
