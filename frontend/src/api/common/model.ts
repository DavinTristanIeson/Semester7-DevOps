export interface IdInput {
  id: string;
}

export type PaginatedInput<T = object> = T & {
  page?: number;
  size?: number;
}

export interface UpdateInput<T> {
  id: string;
  body: T;
}