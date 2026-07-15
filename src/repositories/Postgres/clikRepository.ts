import { injectable } from 'tsyringe';
import { pool } from '../../db/conection';
import { ClickData, IClickRepository } from './IClickRepository';

@injectable()
export class ClickRepository implements IClickRepository {
    async save({code, ipAddress, userAgent}: ClickData): Promise<void> {
        await pool.query(
            'INSERT INTO recoverly.clicks (short_link_code, ip_address, user_agent) VALUES ($1, $2, $3)',
            [code, ipAddress ?? null, userAgent ?? null],

        );
    }
}