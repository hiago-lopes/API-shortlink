import 'reflect-metadata';
import { env } from './Config/env';
import express, { type NextFunction, type Request, type Response } from 'express';
import { routerClickRedirect } from './Routes/clickRedirect';
import { pool, redisClient } from './db/conection';
import { logger } from './Config/logger';
import { AppError } from './errors/AppError';
import { ZodAppError } from './errors/ZodAppError';

const app = express();
const port = env.PORT;

app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info({ method: req.method, url: req.url }, 'incoming request');
    next();
});

app.use('/', routerClickRedirect);

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ZodAppError) {
        return res.status(err.statusCode).json({ error: err.message, issues: err.issues });
    }
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message });
    }
    logger.error({ err }, 'Erro não tratado');
    return res.status(500).json({ error: 'Erro interno do servidor' });
});

pool.connect()
    .then(async (client) => {
        client.release(); // Libera o cliente de volta para o pool após a conexão bem-sucedida
        logger.info('Conexão com PostgreSQL estabelecida com sucesso.');
        await redisClient.connect();
        app.listen(port, () => {
            logger.info(`API ShortLink rodando na porta ${port}`);
        });
    })
    .catch(err => {
        logger.error({ err }, 'Falha: Não foi possível conectar ao banco de dados.');
        process.exit(1);
    });
