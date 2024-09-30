import * as Yup from 'yup';

export function AlbumFormSchema() {
  return Yup.object({
    name: Yup.string().required(),
  });
}

export type AlbumFormType = Yup.InferType<ReturnType<typeof AlbumFormSchema>>;