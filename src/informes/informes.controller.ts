import { Controller, Post, Body } from "@nestjs/common";
import { informesService } from "./informes.service";

@Controller("informe")
export class InformesController {
  constructor(private readonly InformeService: informesService) {}

  @Post("generar")
  async generarInforme(
    @Body() body: { chat: { role: string; message: string }[] },
  ): Promise<string> {
    const { chat } = body;

    // Convertir el chat a un formato de texto, por ejemplo, uniendo los mensajes
    const chatText = chat
      .map((msg) => `${msg.role}: ${msg.message}`)
      .join("\n");

    return this.InformeService.generateReport(chatText);
  }
}
