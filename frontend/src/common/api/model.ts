export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: { [key: string]: string };
  /** Contains information about the original error */
  original?: any;
}

export interface ApiResult<T> {
  data: T;
  message?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface PaginatedApiResult<T> extends PaginationMeta, ApiResult<T[]> { }

