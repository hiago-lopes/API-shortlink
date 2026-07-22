export interface ShortLink {
    id: string;
    url: string;
    userId: string;
    messageId: string | null;
    expiresAt: Date | null;
}

export interface IShortLinkRepository {
    findByCode(code: string): Promise<ShortLink | null>;
}   
