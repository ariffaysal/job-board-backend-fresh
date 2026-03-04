export interface CurrentUser {
    userId: number;
    email: string;
    name: string;
    role: 'agency' | 'client' | 'admin';
    agencyId: number;
    clientId?: number;
}
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
