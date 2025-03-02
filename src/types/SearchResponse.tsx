import { Word } from './Word';

export interface SearchResponse {
  'total': number,
  'pageNo': number,
  'pageSize': number,
  data: Word[]
}
