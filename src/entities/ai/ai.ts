import { Iai } from "./Iai";

export class AI implements Iai {
  public BASE_PROMPT: string;
  public prompt: string;

  constructor(
    public symptoms: string,
    public response: string = "",
    public model: string = "gemini-1.5-flash",
    public temperature: number = 0.7,
    public maxOutputTokens: number = 1000,
  ) {
    this.prompt = `${this.BASE_PROMPT} ${this.symptoms}`;
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
