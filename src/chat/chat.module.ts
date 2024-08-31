import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ChatService } from "./chat.service";
import { GenerateAIResponsesUseCase } from "src/use_cases/responses-ai/responses.ai";
import { AIController } from "./chat.controller";

@Module({
  imports: [ConfigModule],
  providers: [ChatService, GenerateAIResponsesUseCase],
  controllers: [AIController],
})
export class ChatModule {}
