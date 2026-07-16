import { injectable } from 'tsyringe';
import { pool } from '../../db/conection';
import { IShortLinkRepository, ShortLink } from './IShortLinkRepository';

@injectable()
export class ShortLinkRepository implements IShortLinkRepository {
    async findByCode(code: string): Promise<ShortLink | null> {
        const { rows } = await pool.query<{ id:string, url: string, userId: string, messageId: string }>(
            `SELECT sl.id, sl.original_url AS url, m.user_id AS "userId", m.id AS "messageId"
            FROM recoverly.short_links sl
            LEFT JOIN recoverly.messages m ON m.short_link_id = sl.id
            WHERE sl.code = $1
            LIMIT 1`,
            [code]
        );
        return rows.length > 0 ? { id: rows[0].id, url: rows[0].url, userId: rows[0].userId, messageId: rows[0].messageId } : null;
    }
}
