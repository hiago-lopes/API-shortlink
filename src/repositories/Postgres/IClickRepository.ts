export interface ClickData {
    code: string;
    ipAddress: string | null;
    userAgent: string | null;
}

export interface IClickRepository {
    save(data: ClickData): Promise<void>;
}
