import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

@injectable()
export class getRedisValueUseCase { 

    constructor(
        @inject('RedisClient') private redisClient: any 
    ) {}

    async execute(req: Request, res: Response) {

    try {
        const query = 'SELECT url FROM short_links WHERE code = $1 LIMIT 1';
        const { rows } = await pool.query<{ url: string }>(query, [code]);

        const destination = rows[0];

        if (!destination) {
            return res.status(404).send('Not Found: O link solicitado não existe ou foi desativado.');
        }

        const destinationUrl = destination.url;

        return res.redirect(destinationUrl);

    } catch (error) {
        console.error(`[CRITICAL] Falha ao resolver o shortLink '${code}':`, (error as Error).message);
        return res.status(500).send('Internal Server Error.');
    }
}}