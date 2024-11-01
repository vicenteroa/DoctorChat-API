import { Injectable } from "@nestjs/common";
import { CitasService } from "src/citas/citas.service";
import { FirebaseService } from "src/services/firebase/firebase.service";

@Injectable()
export class RegisterCitasUseCase {
  constructor(
    private citasService: CitasService,
    private firebaseService: FirebaseService,
  ) {}

  async execute(user_uid: string, doctor_uid: string, fecha: string) {
    const { userExists, doctorExists } =
      await this.firebaseService.ValidateUserAndDoctor(user_uid, doctor_uid);

    // Validar fecha
    const validateFecha = new Date(fecha);
    if (isNaN(validateFecha.getTime())) {
      throw new Error("La fecha no es válida");
    }

    // Validar usuario y médico
    if (!userExists && !doctorExists) {
      throw new Error("El usuario y médico no existe");
    } else if (!userExists) {
      throw new Error("Usuario no existe en la base de datos");
    } else if (!doctorExists) {
      throw new Error("Médico no existe en la base de datos");
    }

    return this.citasService.registerCitas(user_uid, doctor_uid, fecha);
  }
}
