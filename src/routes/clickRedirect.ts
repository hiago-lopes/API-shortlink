import { Router, Request, Response } from 'express';
import { getRedisValueController } from '../useCases/getRedisValueController.js';
import { container } from 'tsyringe';


export const routerClickRedirect = Router();

routerClickRedirect.get('/:code', async (req: Request, res: Response) => {
    await container.resolve(getRedisValueController).handle(req, res);

});