import { Injectable } from "@nestjs/common";
import { RegisterUserUseCase } from "src/use_cases/register-user/register-user";
import { RegisterUserDto } from "src/dtos/register-user.dto";
import { FirebaseService } from "src/services/firebase/firebase.service";
import { User } from "src/entities/user/user";
import { Logger } from "@nestjs/common";

@Injectable()
export class AuthService {
  private readonly logger = new Logger("AuthService");
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly registerUserUseCase: RegisterUserUseCase,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<string> {
    const { user, email, password, name, rut } = registerUserDto;

    try {
      const userEntity = new User(user, email, password, name, rut);
      const message = await this.registerUserUseCase.execute(userEntity);

      return message;
    } catch (e) {
      this.logger.error("Error al registrar el usuario", e.stack);
      throw new Error("Error al registrar el usuario verifique sus datos");
    }
  }

  async verifyUser(token: string): Promise<any> {
    return this.firebaseService.verifyToken(token);
  }
}
