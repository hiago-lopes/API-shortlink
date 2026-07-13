
export interface IRedisRepository {
    get(key: string): Promise<string | null>;
    set(key: string, value: string, expirationInSeconds?: number): Promise<void>;
}
