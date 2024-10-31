import { Module } from "@nestjs/common";
import { InformesController } from "./informes.controller";
import { informesService } from "./informes.service";
import { ConfigService } from "@nestjs/config";
import { FirebaseService } from "src/services/firebase/firebase.service";
@Module({
  controllers: [InformesController],
  providers: [informesService, ConfigService, FirebaseService],
})
export class InformesModule {}
