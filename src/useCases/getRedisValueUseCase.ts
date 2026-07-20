import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { RedisRepository } from '../repositories/Redis/redisRepository';
import { ShortLinkRepository } from '../repositories/Postgres/shortLinkRepository';
import { ClickRepository } from '../repositories/Postgres/clikRepository';
import { randomUUID } from 'crypto';
import { AppError } from '../errors/AppError';
@injectable()
export class getRedisValueUseCase {
    constructor(
        @inject(RedisRepository) private redis: RedisRepository,
        @inject(ShortLinkRepository) private shortLinkRepository: ShortLinkRepository,
        @inject(ClickRepository) private clickRepository: ClickRepository,
    ) {}

    async execute(req: Request, res: Response) {
        const { code } = req.params;
        
        const cached = await this.redis.get(String(code));
            if (cached) {
                const parsed = JSON.parse(cached) as { id: string; userId: string; messageId: string; originalUrl: string };
                await this.clickRepository.save({
                    id: randomUUID(),
                    linkId: parsed.id,
                    userId: parsed.userId,
                    messageId: parsed.messageId,
                });
                return res.redirect(parsed.originalUrl);
            }
        
        const shortLink = await this.shortLinkRepository.findByCode(String(code));
            if (!shortLink) {
                throw new AppError(404, 'Not Found: Código não encontrado.');
            }
        
        await this.redis.set(String(code), JSON.stringify({
            id: shortLink.id,
            userId: shortLink.userId,
            messageId: shortLink.messageId,
            originalUrl: shortLink.url,
        }));

        await this.clickRepository.save({
            id: randomUUID(),
            linkId: shortLink.id,
            userId: shortLink.userId,
            messageId: shortLink.messageId,
        });
        
        return res.redirect(shortLink.url);
    }
}
