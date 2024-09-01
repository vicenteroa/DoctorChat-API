import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  GoogleGenerativeAI,
  GenerateContentResult,
} from "@google/generative-ai";
import { AI } from "../entities/ai/ai";

@Injectable()
export class ChatService {
  private genAI: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>("GEMINI_API_KEY");
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateResponse(symptoms: string): Promise<string> {
    const aiInstance = AI.create(symptoms, { model: "gemini-1.5-flash" });
    const prompt = aiInstance.prompt;

    const model = this.genAI.getGenerativeModel({ model: aiInstance.model });
    const result: GenerateContentResult = await model.generateContent(prompt);
    const response = result.response;

    aiInstance.setResponse(response.text());
    return response.text();
  }
}
