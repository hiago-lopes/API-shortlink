import 'dotenv/config';
import { env } from '../Config/env';

import { Pool } from 'pg';
import { createClient } from 'redis';

const redisUrl = env.REDIS_URL; // Obtém a URL do Redis a partir das variáveis de ambiente

export const redisClient = createClient({
    url: redisUrl,
});

export const pool = new Pool({
    connectionString: env.DATABASE_URL,
    ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
});
