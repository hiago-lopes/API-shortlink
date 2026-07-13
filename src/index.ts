import 'reflect-metadata';
import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import { Pool } from 'pg';

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
});

app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] GET ${req.originalUrl}`);
    next();
});

app.get('/:code', async (req: Request<{ code: string }>, res: Response) => {
    const { code } = req.params;

    if (!code || code.length > 20) {
        return res.status(400).send('Bad Request: Formato de código inválido.');
    }

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
});

pool.connect()
    .then(() => {
        console.log('Conexão com PostgreSQL estabelecida com sucesso.');
        app.listen(port, () => {
            console.log(`API ShortLink rodando na porta ${port}`);
        });
    })
    .catch(err => {
        console.error('Falha catastrófica: Não foi possível conectar ao banco de dados.', err.stack);
        process.exit(1);
    });
