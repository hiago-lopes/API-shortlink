import { createClient } from 'redis';
import { IRedisRepository } from "./IRedisRepository";
import { inject, injectable } from "tsyringe";

const REDIS_TTLSECONDS = 60 * 60 * 24; // 1 day in seconds

@injectable()
export class RedisRepository implements IRedisRepository {

    async get(key: string): Promise<string | null> {
        return createClient().get(key);
    }

    async set(key: string, value: string, expirationInSeconds = REDIS_TTLSECONDS): Promise<void> {
        await createClient().set(key, value, { EX: expirationInSeconds });
    }
}

