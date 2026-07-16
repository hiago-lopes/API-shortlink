export interface ShortLink {
    id: string;
    url: string;
    userId: string;
    messageId: string;
}

export interface IShortLinkRepository {
    findByCode(code: string): Promise<ShortLink | null>;
}   
