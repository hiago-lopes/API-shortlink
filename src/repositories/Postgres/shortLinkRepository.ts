import { injectable } from 'tsyringe';
import { pool } from '../../db/conection';
import { IShortLinkRepository, ShortLink } from './IShortLinkRepository';

@injectable()
export class ShortLinkRepository implements IShortLinkRepository {
    async findByCode(code: string): Promise<ShortLink | null> {
        const { rows } = await pool.query<{ id:string, url: string }>(
            'SELECT id, original_url AS url FROM recoverly.short_links WHERE code = $1 LIMIT 1',
            [code]
        );
        return rows.length > 0 ? { id: rows[0].id, url: rows[0].url } : null;
    }
}
