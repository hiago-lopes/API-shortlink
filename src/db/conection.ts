import { Pool } from 'pg';
import { createClient } from 'redis';
import 'dotenv/config';

const redisUrl = process.env.REDIS_URL;

    if (!redisUrl) { //tratamento de exeção para a variável de ambiente Redis, nao estar definida
    throw new Error('REDIS_URL não está definida');
    }

    const client = createClient({
    url: redisUrl
});

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    
})