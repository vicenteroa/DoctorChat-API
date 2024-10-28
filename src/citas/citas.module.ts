import { Module } from "@nestjs/common";
import { CitasService } from "./citas.service";
import { CitasController } from "./citas.controller";
import { ConfigService } from "@nestjs/config";
import { FirebaseService } from "src/services/firebase/firebase.service";
@Module({
  controllers: [CitasController],
  providers: [CitasService, ConfigService, FirebaseService],
})
export class CitasModule {}
