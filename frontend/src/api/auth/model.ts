// Models
export class UserModel {
  email: string;
}

// Inputs
export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
}