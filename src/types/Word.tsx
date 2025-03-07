import { Language } from './Language';
import { User } from './User';

export interface Word {
  id: number;
  languageId: number;
  userId: number;
  name: string;
  meaning: string;
  tags: string;
  englishMeaning: string | null;
  description?: string | null;
  isActive: boolean;
  isApproved: boolean;
  isSaved: boolean;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
  language: Language;
  user: User;
}
