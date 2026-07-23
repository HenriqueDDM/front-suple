export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}

export interface SalesListQuery {
  page?: number;
  limit?: number;
}
