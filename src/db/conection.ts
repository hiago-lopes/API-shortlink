import 'dotenv/config';
import { env } from '../config/env';

import { Pool } from 'pg';
import { createClient } from 'redis';

const redisUrl = env.REDIS_URL; // Obtém a URL do Redis a partir das variáveis de ambiente

export const redisClient = createClient({
    url: redisUrl,
});

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
});
