export interface PagingResponse<T> {
  total: number,
  pageNo: number,
  pageSize: number,
  data: T[]
}
