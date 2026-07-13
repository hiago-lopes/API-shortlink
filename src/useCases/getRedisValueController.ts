import { inject, injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { getRedisValueUseCase } from '@UseCases/getRedisValueUseCase';

@injectable()
export class getRedisValue {

    constructor(
        @inject('RedisClient') private redisClient: any 
    )

        async handle(req: Request, res: Response): Promise<void> {
        const { code } = req.params;

        if(!code || code.length > 20) {
            return res.status(400).send('Bad Request: Formato de código inválido.');
        }   

        const result = await getRedisValueUseCase.execute(req, res);
    }

}