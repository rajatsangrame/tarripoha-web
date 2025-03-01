import { Language } from './Language';
import { User } from './User';

export interface Word {
    id: number;
    languageId: number;
    userId: number;
    name: string;
    meaning: string;
    englishMeaning: string| null;
    description?: string | null;
    isActive: boolean;
    isApproved: boolean;
    createdAt: string;
    updatedAt: string;
    language: Language;
    user: User;
}
