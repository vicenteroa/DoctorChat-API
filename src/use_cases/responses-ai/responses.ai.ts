import { Injectable } from "@nestjs/common";
import { ChatService } from "src/chat/chat.service";
@Injectable()
export class GenerateAIResponsesUseCase {
  constructor(private aiService: ChatService) {}

  async execute(symptoms: string): Promise<string> {
    return this.aiService.generateResponse(symptoms);
  }
}
