import { Injectable } from "@nestjs/common";
import { Doctor } from "src/entities/doctor/doctor";
import { DoctorRepository } from "src/entities/doctor/doctor.repository";

@Injectable()
export class RegisterDoctorUseCase {
  constructor(private readonly doctorRepository: DoctorRepository) {}

  async execute(doctor: Doctor): Promise<void> {
    try {
      await this.doctorRepository.createDoctor(doctor);
    } catch (e) {
      throw new Error("Error al registrar el médico: " + e.message);
    }
  }
}
