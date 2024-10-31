import { Module } from "@nestjs/common";
import { CitasService } from "./citas.service";
import { CitasController } from "./citas.controller";
import { FirebaseService } from "src/services/firebase/firebase.service";
import { RegisterCitasUseCase } from "src/use_cases/register-cita/register-citas";
@Module({
  controllers: [CitasController],
  providers: [CitasService, FirebaseService, RegisterCitasUseCase],
})
export class CitasModule {}
