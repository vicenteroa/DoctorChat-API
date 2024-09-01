import { Iai } from "./Iai";

export class AI implements Iai {
  private static readonly BASE_PROMPT =
    "Eres MedicoAI, un asistente diseñado para ayudar a identificar qué tipo de especialista médico podría ser relevante basado en la descripción de los síntomas proporcionados. Basado en esta información, sugiere el tipo de especialista que podría ser útil. Al final, siempre preguntar especificamente: '¿Desea agendar una cita con alguno de los doctores de nuestro sistema?' Ten en cuenta que esta recomendación es general y no sustituye el consejo médico profesional.";

  public prompt: string;

  constructor(
    public symptoms: string,
    public response: string = "",
    public model: string = "gemini-1.5-flash",
    public temperature: number = 0.7,
    public maxOutputTokens: number = 1000,
  ) {
    this.prompt = `${AI.BASE_PROMPT} ${this.symptoms}`;
  }
  static create(symptoms: string, options?: Partial<AI>): AI {
    return new AI(
      symptoms,
      options?.response || "",
      options?.model || "gemini-1.5-flash",
      options?.temperature || 0.7,
      options?.maxOutputTokens || 1000,
    );
  }
  setResponse(response: string) {
    this.response = response;
  }
  toJSON() {
    return {
      symptoms: this.symptoms,
      model: this.model,
      temperature: this.temperature,
      maxOutputTokens: this.maxOutputTokens,
      response: this.response,
    };
  }
}
