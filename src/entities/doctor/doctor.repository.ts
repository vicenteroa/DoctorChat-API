import { Injectable } from "@nestjs/common";
import { Doctor } from "src/entities/doctor/doctor";
import { FirebaseService } from "src/services/firebase/firebase.service";

@Injectable()
export class DoctorRepository {
  constructor(private readonly firebaseService: FirebaseService) {}

  async createDoctor(doctor: Doctor): Promise<void> {
    try {
      const doctorCredential =
        await this.firebaseService.createUserAuth(doctor);
      const doctorId = doctorCredential.uid;

      if (!doctorId) {
        throw new Error("No se recibió un ID de usuario válido.");
      }
      // Registrar en Firestore
      const doctorStore = new Doctor(
        doctor.user,
        doctor.email,
        doctor.password,
        doctor.name,
        doctor.rut,
        doctor.specialist,
      );
      doctorStore.id = doctorId;
      await this.firebaseService.createDoctorStore(doctorStore);
    } catch (error) {
      throw new Error("Error al crear el usuario: " + error.message);
    }
  }
}
