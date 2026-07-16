export interface ClickData {
    id: string;
    linkId: string;
    userId: string;
    messageId: string;
}

export interface IClickRepository {
    save(data: ClickData): Promise<void>;
}
