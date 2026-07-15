import 'reflect-metadata';
import { env } from './config/env';
import express, { type NextFunction, type Request, type Response } from 'express';
import { routerClickRedirect } from './routes/clickRedirect';
import { pool, redisClient } from './db/conection';

const app = express();
const port = env.PORT;

app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] GET ${req.originalUrl}`);
    next();
});

app.use('/', routerClickRedirect);

pool.connect()
    .then(async (client) => {
        client.release(); // Libera o cliente de volta para o pool após a conexão bem-sucedida
        console.log('Conexão com PostgreSQL estabelecida com sucesso.');
        await redisClient.connect();
        app.listen(port, () => {
            console.log(`API ShortLink rodando na porta ${port}`);
        });
    })
    .catch(err => {
        console.error('Falha: Não foi possível conectar ao banco de dados.', err.stack);
        process.exit(1);
    });
