export type TableHeaderData = { key: string; header: string };
export type PaginationChangeParams = { page: number; pageSize: number };
export type SortDirection = 'ASC' | 'DESC';
export type SortInfo = {
  headerKey: string;
  sortDirection: SortDirection;
};
