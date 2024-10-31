import { Controller, Post, Body } from "@nestjs/common";
import { RegisterCitasUseCase } from "src/use_cases/register-cita/register-citas";

@Controller("citas")
export class CitasController {
  constructor(private readonly registerCitasUseCase: RegisterCitasUseCase) {}

  @Post("register")
  async registerCita(
    @Body("user_uid") user_uid: string,
    @Body("doctor_uid") doctor_uid: string,
    @Body("fecha") fecha: string,
  ) {
    try {
      await this.registerCitasUseCase.execute(user_uid, doctor_uid, fecha);
      return { message: "Cita registrada exitosamente" };
    } catch (error) {
      return { message: "Error al registrar la cita", error: error.message };
    }
  }
}
