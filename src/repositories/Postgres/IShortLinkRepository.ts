export interface ShortLink {
    url: string;
}

export interface IShortLinkRepository {
    findByCode(code: string): Promise<ShortLink | null>;
}   
