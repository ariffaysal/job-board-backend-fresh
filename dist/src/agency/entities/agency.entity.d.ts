import { Client } from './client.entity';
export declare class Agency {
    id: number;
    email: string;
    name: string;
    password: string;
    clients: Client[];
}
