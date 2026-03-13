"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const generative_ai_1 = require("@google/generative-ai");
let GeminiService = class GeminiService {
    config;
    genAI = null;
    constructor(config) {
        this.config = config;
        const apiKey = this.config.get('GEMINI_API_KEY');
        if (apiKey) {
            this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        }
    }
    getModel() {
        if (!this.genAI) {
            throw new common_1.ServiceUnavailableException('GEMINI_API_KEY is not set. Configure it in .env to use AI features.');
        }
        return this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    }
    async generateContentFromPdf(pdfBuffer, prompt) {
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
            throw new common_1.ServiceUnavailableException('Gemini returned no text. The PDF may be unsupported or the prompt blocked.');
        }
        return text;
    }
    async generateText(prompt) {
        const model = this.getModel();
        const result = await model.generateContent(prompt);
        const text = result.response.text?.();
        if (!text) {
            throw new common_1.ServiceUnavailableException('Gemini returned no text.');
        }
        return text;
    }
    async embedText(text) {
        const apiKey = this.config.get('GEMINI_API_KEY');
        if (!apiKey) {
            throw new common_1.ServiceUnavailableException('GEMINI_API_KEY is not set. Configure it to use semantic search.');
        }
        const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
        const result = await model.embedContent({
            content: { role: 'user', parts: [{ text }] },
        });
        const values = result.embedding?.values;
        if (!values || !Array.isArray(values)) {
            throw new common_1.ServiceUnavailableException('Gemini returned no embedding.');
        }
        return values;
    }
};
exports.GeminiService = GeminiService;
exports.GeminiService = GeminiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GeminiService);
//# sourceMappingURL=gemini.service.js.map