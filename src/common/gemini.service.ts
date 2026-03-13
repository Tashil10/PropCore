import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private readonly genAI: GoogleGenerativeAI | null = null;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('GEMINI_API_KEY');
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  private getModel() {
    if (!this.genAI) {
      throw new ServiceUnavailableException(
        'GEMINI_API_KEY is not set. Configure it in .env to use AI features.',
      );
    }
    return this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }

  /**
   * Send PDF buffer and a text prompt; returns the model text response.
   */
  async generateContentFromPdf(
    pdfBuffer: Buffer,
    prompt: string,
  ): Promise<string> {
    const model = this.getModel();
    const base64 = pdfBuffer.toString('base64');
    const result = await model.generateContent([
      { text: prompt },
      {
        inlineData: {
          mimeType: 'application/pdf',
          data: base64,
        },
      },
    ]);
    const response = result.response;
    const text = response.text?.();
    if (!text) {
      throw new ServiceUnavailableException(
        'Gemini returned no text. The PDF may be unsupported or the prompt blocked.',
      );
    }
    return text;
  }

  /**
   * Text-only generation (for triage, etc.).
   */
  async generateText(prompt: string): Promise<string> {
    const model = this.getModel();
    const result = await model.generateContent(prompt);
    const text = result.response.text?.();
    if (!text) {
      throw new ServiceUnavailableException('Gemini returned no text.');
    }
    return text;
  }

  /**
   * Get embedding vector for text (for semantic search).
   * Uses Gemini embedding model when available.
   */
  async embedText(text: string): Promise<number[]> {
    const apiKey = this.config.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new ServiceUnavailableException(
        'GEMINI_API_KEY is not set. Configure it to use semantic search.',
      );
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
    const result = await model.embedContent({
      content: { role: 'user', parts: [{ text }] },
    });
    const values = result.embedding?.values;
    if (!values || !Array.isArray(values)) {
      throw new ServiceUnavailableException('Gemini returned no embedding.');
    }
    return values;
  }
}
