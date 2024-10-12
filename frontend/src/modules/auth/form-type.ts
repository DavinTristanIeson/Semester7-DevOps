import * as Yup from 'yup';

export function AuthFormSchema() {
  return Yup.object({
    username: Yup.string().min(5).required().matches(/[a-zA-Z0-9]/, {
      message: "Username must only consist of letters or numbers"
    }),
    password: Yup.string().min(8).required(),
  });
}
export type AuthFormType = Yup.InferType<ReturnType<typeof AuthFormSchema>>;