import { ConfigService } from '@nestjs/config';
export declare class GeminiService {
    private readonly config;
    private readonly genAI;
    constructor(config: ConfigService);
    private getModel;
    generateContentFromPdf(pdfBuffer: Buffer, prompt: string): Promise<string>;
    generateText(prompt: string): Promise<string>;
    embedText(text: string): Promise<number[]>;
}
