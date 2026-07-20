import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { z } from 'zod';
import { ZodAppError } from '../errors/ZodAppError';

import { getRedisValueUseCase } from './getRedisValueUseCase';

const paramsSchema = z.object({
    code: z.string().min(1).max(20),
});

@injectable()
export class getRedisValueController {

    constructor(
        @inject(getRedisValueUseCase) private useCase: getRedisValueUseCase,
    ) {}

    async handle(req: Request, res: Response): Promise<void> {

        const result = paramsSchema.safeParse(req.params);
        if (!result.success) {
            throw new ZodAppError(result.error);
        }

        await this.useCase.execute(req, res);
    }
}
