require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20, 
    idleTimeoutMillis: 30000,
});

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] GET ${req.originalUrl}`);
    next();
});


app.get('/:code', async (req, res) => {
    const { code } = req.params;

    if (!code || typeof code !== 'string' || code.length > 20) {
        return res.status(400).send('Bad Request: Formato de código inválido.');
    }

    try {
        const query = 'SELECT url FROM short_links WHERE code = $1 LIMIT 1';
        const { rows } = await pool.query(query, [code]);

        if (rows.length === 0) {
            return res.status(404).send('Not Found: O link solicitado não existe ou foi desativado.');
        }

        const destinationUrl = rows[0].url;
        
        return res.redirect(destinationUrl);

    } catch (error) {
        console.error(`[CRITICAL] Falha ao resolver o shortLink '${code}':`, error.message);
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