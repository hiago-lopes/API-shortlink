import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

import { getRedisValueUseCase } from './getRedisValueUseCase';

@injectable()
export class getRedisValueController {

    constructor(
        @inject(getRedisValueUseCase) private useCase: getRedisValueUseCase,
    ) {}

    async handle(req: Request, res: Response): Promise<void> {
        const { code } = req.params;

        if (!code || code.length > 20) {
            res.status(400).send('Bad Request: Formato de código inválido.');
            return;
        }

        await this.useCase.execute(req, res);
    }
}
