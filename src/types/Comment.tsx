import { User } from './User';

export interface Comment {
  id: number;
  text: string;
  userId: number;
  contentId: number;
  contentType: number;
  isActive: boolean;
  isLiked: boolean;
  totalLikes: number;
  createdAt: string;
  updatedAt: string;
  user: User;
}
