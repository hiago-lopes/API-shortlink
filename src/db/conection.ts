import 'dotenv/config';

import { Pool } from 'pg';
import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) { //tratamento de exceção para a variável de ambiente Redis não estar definida
    throw new Error('REDIS_URL não está definida');
}

export const redisClient = createClient({
    url: redisUrl,
});

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
});
