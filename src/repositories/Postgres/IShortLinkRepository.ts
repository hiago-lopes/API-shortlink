export interface ShortLink {
    id: string;
    url: string;
}

export interface IShortLinkRepository {
    findByCode(code: string): Promise<ShortLink | null>;
}   
