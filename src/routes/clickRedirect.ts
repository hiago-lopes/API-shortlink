import { Router, Request, Response } from 'express';
import { container } from 'tsyringe';

import { getRedisValueController } from '../useCases/getRedisValueController';


export const routerClickRedirect = Router();

routerClickRedirect.get('/:code', async (req: Request, res: Response) => {
    await container.resolve(getRedisValueController).handle(req, res);

});