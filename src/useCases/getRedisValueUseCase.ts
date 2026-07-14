import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { pool } from '../db/conection';
import {RedisRepository } from '../repositories/Redis/redisRepository';

@injectable()
export class getRedisValueUseCase {
    constructor(
        @inject(RedisRepository) private redis: RedisRepository,
    ) {}

    async execute(req: Request, res: Response) {
        const { code } = req.params;

        const cached = await this.redis.get(String(code));
            if (cached) {
                return res.redirect(cached); // cache hit, redireciona para a URL que esta no cache
            }
        
        const { rows } = await pool.query<{ url: string }>(' SELECT original_url FROM recoverly.short_links WHERE code = $1 LIMIT 1', [code]);
            if (!rows[0]) {
                return res.status(404).send('Not Found');
            }
        
        await this.redis.set(String(code), rows[0].url); //cache miss, salva no cache a url que foi buscada no postgres
        return res.redirect(rows[0].url);
    }
}
