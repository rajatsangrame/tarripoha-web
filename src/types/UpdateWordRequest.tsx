export interface UpdateWordRequest {
  name?: string;
  meaning?: string;
  englishMeaning?: string;
  languageId: number;
  description?: string;
  tags?: string;
  isActive?: boolean;
}