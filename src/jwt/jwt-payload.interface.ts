export interface JwtPayload {
    userId: number;
    email: string;
    role: 'admin' | 'user';
    iat?: number;
    exp?: number;
}