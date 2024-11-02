import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { FirebaseService } from "src/services/firebase/firebase.service";
import { RegisterUserUseCase } from "src/use_cases/register-user/register-user";
import { RegisterDoctorUseCase } from "src/use_cases/register-doctor/register-doctor";
import { ConfigModule } from "@nestjs/config";
import { UserRepository } from "src/entities/user/user.repository";
import { DoctorRepository } from "src/entities/doctor/doctor.repository";
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    FirebaseService,
    RegisterUserUseCase,
    RegisterDoctorUseCase,
    UserRepository,
    DoctorRepository,
  ],
})
export class AuthModule {}
