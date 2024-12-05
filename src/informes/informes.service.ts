import { Injectable } from "@nestjs/common";
import {
  GoogleGenerativeAI,
  GenerateContentResult,
} from "@google/generative-ai";
import { AI } from "src/entities/ai/ai";
import { ConfigService } from "@nestjs/config";
import { FirebaseService } from "src/services/firebase/firebase.service";
import * as PDFDocument from "pdfkit";
import * as path from "path";
import * as fs from "fs";

@Injectable()
export class informesService {
  private genAI: GoogleGenerativeAI;

  constructor(
    private configService: ConfigService,
    private firebaseService: FirebaseService,
  ) {
    const apiKey = this.configService.get<string>("GEMINI_API_KEY");
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  private static readonly PROMPTS = {
    preInformeMedico:
      "Resume el chat y proporciona un pre informe médico breve con los datos clave (no debe incluir titulos solo texto): ",
    resumenDeSintomas:
      "Genera un resumen corto y claro de los síntomas mencionados en el chat(no debe incluir titulos solo texto): ",
    recomendacionEspecialista:
      "Ofrecele consejos al especialista recomendado , debes decirle por ejemplo que debiese preguntar al paciente al llegar a la consulta que cosas del cuerpo le podria revisar(no debe incluir titulos solo texto sin formato markdown debe ser Breve) : ",
  };

  async generateReport(chat: string): Promise<string> {
    const preInformeAI = AI.create(chat);
    const resumenAI = AI.create(chat);
    const recomendacionAI = AI.create(chat);

    const preInformeResponse = await this.getAIResponse(
      preInformeAI,
      informesService.PROMPTS.preInformeMedico,
    );
    const resumenResponse = await this.getAIResponse(
      resumenAI,
      informesService.PROMPTS.resumenDeSintomas,
    );
    const recomendacionResponse = await this.getAIResponse(
      recomendacionAI,
      informesService.PROMPTS.recomendacionEspecialista,
    );

    const sourceFilePath = path.join(
      __dirname,
      "../../temp/doctorchat_informe_medico.pdf",
    );

    await this.modifyPDFFile(sourceFilePath, {
      preInforme: preInformeResponse,
      resumen: resumenResponse,
      recomendacion: recomendacionResponse,
    });

    const newFileName = `informes/modified_report_${Date.now()}.pdf`;

    // Sube el archivo modificado a Firebase Storage y obtiene el path
    const uploadedFilePath = await this.firebaseService.uploadFile(
      sourceFilePath,
      newFileName,
    );
    let downloadURL =
      await this.firebaseService.getDownloadURL(uploadedFilePath);
    downloadURL = downloadURL.replace(/\/\//g, "/");

    return downloadURL; // Retorna la URL de descarga
  }

  private async getAIResponse(ai: AI, prompt: string): Promise<string> {
    ai.prompt = `${prompt}${ai.symptoms}`;

    const model = this.genAI.getGenerativeModel({ model: ai.model });
    const result: GenerateContentResult = await model.generateContent(
      ai.prompt,
    );

    ai.setResponse(result.response.text());
    return ai.response;
  }

  private async modifyPDFFile(
    sourceFilePath: string,
    responses: { preInforme: string; resumen: string; recomendacion: string },
  ): Promise<void> {
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    // Define the path for the new PDF file
    const pdfFilePath = sourceFilePath.replace(".xlsx", ".pdf");

    // Create a write stream for the new PDF file
    const writeStream = fs.createWriteStream(pdfFilePath);
    doc.pipe(writeStream);

    // Add a title
    doc.fontSize(22).text("Informe Médico", { align: "center" });
    doc.moveDown(2); // Agrega espacio después del título

    // Add pre Informe Médico
    doc
      .fontSize(14)
      .text("Pre Informe Médico:", { underline: true, align: "left" });
    doc.fontSize(12).text(responses.preInforme, { align: "left" });
    doc.moveDown();

    // Add Resumen de Síntomas
    doc
      .fontSize(14)
      .text("Resumen de Síntomas:", { underline: true, align: "left" });
    doc.fontSize(12).text(responses.resumen, { align: "left" });
    doc.moveDown();

    // Add Recomendación al Especialista
    doc
      .fontSize(14)
      .text("Recomendación al Especialista:", {
        underline: true,
        align: "left",
      });
    doc.fontSize(12).text(responses.recomendacion, { align: "left" });

    // Add footer (e.g., page number)
    doc.moveDown();
    doc
      .fontSize(10)
      .text("Informe generado automáticamente", { align: "center" });

    // Add pagination
    doc.on("pageAdded", () => {
      doc
        .fontSize(10)
        .text(`Página ${doc.page} de {PAGE_COUNT}`, {
          align: "center",
          continued: false,
        });
    });

    // Finalize the PDF and end the stream
    doc.end();

    // Wait for the write stream to finish
    await new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    // Replace the sourceFilePath with the new PDF file path
    sourceFilePath = pdfFilePath;
  }
}
