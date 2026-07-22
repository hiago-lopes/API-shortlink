import { injectable } from 'tsyringe';
import { pool } from '../../db/conection';
import { IShortLinkRepository, ShortLink } from './IShortLinkRepository';

@injectable()
export class ShortLinkRepository implements IShortLinkRepository {
    async findByCode(code: string): Promise<ShortLink | null> {
        const { rows } = await pool.query<{ id: string, url: string, userId: string, messageId: string | null, expiresAt: Date | null }>(
            `SELECT sl.id, sl.original_url AS url, sl.user_id AS "userId", m.id AS "messageId", sl.expires_at AS "expiresAt"
            FROM recoverly.short_links sl
            LEFT JOIN recoverly.messages m ON m.short_link_id = sl.id
            WHERE sl.code = $1
            LIMIT 1`,
            [code]
        );
        if (rows.length === 0) return null;
        const row = rows[0];
        return { id: row.id, url: row.url, userId: row.userId, messageId: row.messageId, expiresAt: row.expiresAt };
    }
}
