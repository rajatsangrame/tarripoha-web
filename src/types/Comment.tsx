import { User } from './User';

export interface Comment {
  id: number;
  text: string;
  userId: number;
  contentId: number;
  contentType: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user: User;
}
