import { redisClient } from '../../db/conection';
import { IRedisRepository } from "./IRedisRepository";
import { injectable } from "tsyringe";

const REDIS_TTLSECONDS = 60 * 60 * 24; // 1 dia

@injectable()
export class RedisRepository implements IRedisRepository {
    async get(key: string): Promise<string | null> {
        return redisClient.get(key);
    }

    async set(key: string, value: string, expirationInSeconds = REDIS_TTLSECONDS): Promise<void> {
        await redisClient.set(key, value, { EX: expirationInSeconds });
    }
}

