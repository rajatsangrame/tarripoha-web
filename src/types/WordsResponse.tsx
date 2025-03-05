import { Word } from './Word';

export interface WordsResponse {
  'total': number,
  'pageNo': number,
  'pageSize': number,
  data: Word[]
}
