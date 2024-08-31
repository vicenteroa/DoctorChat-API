import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { GenerateAIResponsesUseCase } from "src/use_cases/responses-ai/responses.ai";

@Controller("ai")
export class AIController {
  constructor(private generateAIResponseUseCase: GenerateAIResponsesUseCase) {}

  @Post("recommend-specialist")
  async recommendSpecialist(@Body() body: { symptoms: string }) {
    try {
      const response = await this.generateAIResponseUseCase.execute(
        body.symptoms,
      );
      return { response };
    } catch (error) {
      throw new HttpException(
        `Error generating AI response ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
