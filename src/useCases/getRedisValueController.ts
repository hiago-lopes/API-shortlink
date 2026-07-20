import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { AppError } from '../errors/AppError';

import { getRedisValueUseCase } from './getRedisValueUseCase';

@injectable()
export class getRedisValueController {

    constructor(
        @inject(getRedisValueUseCase) private useCase: getRedisValueUseCase,
    ) {}

    async handle(req: Request, res: Response): Promise<void> {
        const { code } = req.params;

        if (!code || code.length > 20) {
            throw new AppError(400, 'Bad Request: Formato de código inválido.');
        }

        await this.useCase.execute(req, res);
    }
}
