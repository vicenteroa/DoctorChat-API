import { Injectable } from "@nestjs/common";
import {
  GoogleGenerativeAI,
  GenerateContentResult,
} from "@google/generative-ai";
import { AI } from "src/entities/ai/ai";
import { ConfigService } from "@nestjs/config";
import { FirebaseService } from "src/services/firebase/firebase.service";
import * as ExcelJS from "exceljs";
import * as path from "path";

@Injectable()
export class CitasService {
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
      CitasService.PROMPTS.preInformeMedico,
    );
    const resumenResponse = await this.getAIResponse(
      resumenAI,
      CitasService.PROMPTS.resumenDeSintomas,
    );
    const recomendacionResponse = await this.getAIResponse(
      recomendacionAI,
      CitasService.PROMPTS.recomendacionEspecialista,
    );

    const sourceFilePath = path.join(
      __dirname,
      "../../temp/doctorchat_informe_medico.xlsx",
    );

    await this.modifyExcelFile(sourceFilePath, {
      preInforme: preInformeResponse,
      resumen: resumenResponse,
      recomendacion: recomendacionResponse,
    });

    const newFileName = `informes/modified_report_${Date.now()}.xlsx`;

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

  private async modifyExcelFile(
    sourceFilePath: string,
    responses: { preInforme: string; resumen: string; recomendacion: string },
  ): Promise<void> {
    const workbook = new ExcelJS.Workbook();

    await workbook.xlsx.readFile(sourceFilePath);

    const worksheet = workbook.getWorksheet(1);

    // Limpia las celdas antes de agregar nuevos valores
    worksheet.getCell("A11").value = null;
    worksheet.getCell("A19").value = null;
    worksheet.getCell("A26").value = null;
    // Agrega nuevo valor
    worksheet.getCell("A11").value = responses.preInforme;
    worksheet.getCell("A19").value = responses.resumen;
    worksheet.getCell("A26").value = responses.recomendacion;

    // Guarda los cambios en el mismo archivo
    await workbook.xlsx.writeFile(sourceFilePath);
  }
}
