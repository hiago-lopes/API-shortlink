import { injectable } from 'tsyringe';
import { pool } from '../../db/conection';
import { ClickData, IClickRepository } from './IClickRepository';

@injectable()
export class ClickRepository implements IClickRepository {
    async save({id, linkId, userId, messageId}: ClickData): Promise<void> {
        await pool.query(
            'INSERT INTO recoverly.short_link_clicks (id, link_id, user_id, message_id) VALUES ($1, $2, $3, $4)',
            [id, linkId, userId, messageId ?? null]
        );
    }
}