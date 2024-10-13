// Models
export class UserModel {
  id: number;
  username: string;
}

// Inputs
export interface LoginInput {
  username: string;
  password: string;
}

export interface RegisterInput {
  username: string;
  password: string;
}