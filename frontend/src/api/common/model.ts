export interface IdInput {
  id: string;
}

export interface UpdateInput<T> {
  id: string;
  body: T;
}