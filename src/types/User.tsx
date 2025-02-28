export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
}
