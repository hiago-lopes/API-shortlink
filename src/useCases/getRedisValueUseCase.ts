import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { RedisRepository } from '../repositories/Redis/redisRepository';
import { ShortLinkRepository } from '../repositories/Postgres/shortLinkRepository';
import { ClickRepository } from '../repositories/Postgres/clikRepository';

@injectable()
export class getRedisValueUseCase {
    constructor(
        @inject(RedisRepository) private redis: RedisRepository,
        @inject(ShortLinkRepository) private shortLinkRepository: ShortLinkRepository,
        @inject(ClickRepository) private clickRepository: ClickRepository,
    ) {}

    async execute(req: Request, res: Response) {
        const { code } = req.params;
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'] || null;
        
        const cached = await this.redis.get(String(code));
            if (cached) {
                await this.clickRepository.save({ code: String(code), ipAddress, userAgent });
                return res.redirect(cached);
            }
        
        const shortLink = await this.shortLinkRepository.findByCode(String(code));
        if (!shortLink) {
            return res.status(404).send('Not Found: Código não encontrado.');
        }
        
        await this.redis.set(String(code), shortLink.url); 
        await this.clickRepository.save({ code: String(code), ipAddress, userAgent });
        return res.redirect(shortLink.url);
    }
}
