import { IUser } from "./Iuser";

export class User implements IUser {
  id?: string;
  user: string;
  email: string;
  password: string;
  name: string;
  rut: string;

  constructor(
    user: string,
    email: string,
    password: string,
    name: string,
    rut: string,
  ) {
    if (!user || !email || !password || !name || !rut) {
      throw new Error("Todos los campos son obligatorios");
    }
    this.user = user;
    this.email = email;
    this.password = password;
    this.name = name;
    this.rut = rut;

    this.ValidateRut(rut);
    this.ValidateEmail(email);
  }

  ValidateEmail(email: string): void {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Email inválido");
    }
  }
  private ValidateRut(rut: string): void {
    const rutClean = rut.replace(/\s|-|\.|,/g, "").toUpperCase();
    const rutRegex = /^\d{7,8}[0-9K]$/;
    if (!rutRegex.test(rutClean)) {
      throw new Error("Invalid RUT format");
    }

    const body = rutClean.slice(0, -1);
    const dv = rutClean.slice(-1);

    if (dv !== this.calculateDV(body)) {
      throw new Error("Invalid RUT digit verifier");
    }
  }
  private calculateDV(body: string): string {
    let sum = 0;
    let multiplier = 2;

    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body.charAt(i), 10) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const remainder = 11 - (sum % 11);

    if (remainder === 11) return "0";
    if (remainder === 10) return "K";
    return remainder.toString();
  }
}
