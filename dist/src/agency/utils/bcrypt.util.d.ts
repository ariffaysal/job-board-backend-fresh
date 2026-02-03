export declare function hashPassword(password: string): Promise<string>;
export declare function comparePasswords(password: string, hash: string): Promise<boolean>;
