import { Controller, Post, Body } from "@nestjs/common";
import { CitasService } from "./citas.service";

@Controller("citas")
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  @Post("generar-informe")
  async generarInforme(
    @Body() body: { chat: { role: string; message: string }[] },
  ): Promise<string> {
    const { chat } = body;

    // Convertir el chat a un formato de texto, por ejemplo, uniendo los mensajes
    const chatText = chat
      .map((msg) => `${msg.role}: ${msg.message}`)
      .join("\n");

    return this.citasService.generateReport(chatText);
  }
}
