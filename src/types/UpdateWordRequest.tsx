import { Word } from './Word';

export interface UpdateWordRequest {
  name?: string;
  meaning?: string;
  englishMeaning?: string;
  languageId: number;
  description?: string;
  tags?: string;
  isActive?: boolean;
  isApproved?: boolean;
}

export function createUpdateWordRequest(word: Word): UpdateWordRequest {
  return {
    name: word.name,
    meaning: word.meaning,
    languageId: word.languageId,
    englishMeaning: word.englishMeaning,
    description: word.description,
    tags: word.tags,
    isActive: word.isActive,
    isApproved: word.isApproved
  };
}