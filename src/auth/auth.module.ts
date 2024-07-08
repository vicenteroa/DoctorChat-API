import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { FirebaseService } from "src/firebaseConfig";
import { RegisterUserUseCase } from "src/use_cases/register-user/register-user";
import { ConfigModule } from "@nestjs/config";
@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AuthController],
  providers: [AuthService, FirebaseService, RegisterUserUseCase],
})
export class AuthModule {}
