import * as Yup from 'yup';

export function AuthFormSchema() {
  return Yup.object({
    email: Yup.string().email().required(),
    password: Yup.string().min(8).required(),
  });
}
export type AuthFormType = Yup.InferType<ReturnType<typeof AuthFormSchema>>;