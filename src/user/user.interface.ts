export interface UserData {
    id: number;
    firstName?: string | null;
    lastName?: string | null;
    email: string;
    role?: string;
    createdAt: Date;
}