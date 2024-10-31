import { Injectable } from "@nestjs/common";
import { CitasService } from "src/citas/citas.service";

@Injectable()
export class RegisterCitasUseCase {
  constructor(private citasService: CitasService) {}

  async execute(user_uid: string, doctor_uid: string, fecha: string) {
    return this.citasService.registerCitas(user_uid, doctor_uid, fecha);
  }
}
