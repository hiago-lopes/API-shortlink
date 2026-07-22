import { injectable } from 'tsyringe';
import { pool } from '../../db/conection';
import { ClickData, IClickRepository } from './IClickRepository';

@injectable()
export class ClickRepository implements IClickRepository {
    async save({id, linkId, userId, messageId}: ClickData): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            await client.query(
                'INSERT INTO recoverly.short_link_clicks (id, link_id, user_id, message_id) VALUES ($1, $2, $3, $4)',
                [id, linkId, userId, messageId]
            );
            await client.query(
                'UPDATE recoverly.short_links SET click_count = click_count + 1 WHERE id = $1',
                [linkId]
            );
            await client.query('COMMIT');
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }
}