import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  GoogleGenerativeAI,
  GenerateContentResult,
} from "@google/generative-ai";

@Injectable()
export class ChatService {
  private genAI: GoogleGenerativeAI;
  private readonly BASE_PROMPT =
    "Eres un especialista en dar el mejor especialista medico segun los sintomas proporcionados por el paciente";

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>("GEMINI_API_KEY");
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateResponse(symptoms: string): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `${this.BASE_PROMPT} ${symptoms}`;

    const result: GenerateContentResult = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  }
}
