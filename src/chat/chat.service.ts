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

  private readonly BASE_PROMPT: string =
    "Eres MedicoAI, un asistente diseñado para ayudar a identificar qué tipo de especialista médico podría ser relevante basado en la descripción de los síntomas proporcionados. Basado en esta información, sugiere el tipo de especialista que podría ser útil. Al saber los sintomas del paciente puedes decir: 'Apreta el boton para citar con alguno de los doctores de nuestro sistema (recuerda que no entrego links)' Ten en cuenta que esta recomendación es general y no sustituye el consejo médico profesional.";

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>("GEMINI_API_KEY");
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateResponse(symptoms: string): Promise<string> {
    // Construyo la prompt usando BASE_PROMPT y los síntomas
    const prompt = `${this.BASE_PROMPT} ${symptoms}`;

    const aiInstance = AI.create(symptoms, { model: "gemini-1.5-flash" });

    const model = this.genAI.getGenerativeModel({ model: aiInstance.model });
    const result: GenerateContentResult = await model.generateContent(prompt);
    const response = result.response;

    aiInstance.setResponse(response.text());
    return response.text();
  }
}
