import { Injectable } from "@nestjs/common";
import { User } from "src/entities/user/user";
import { UserRepository } from "src/entities/user/user.repository";
import { RegisterUserDto } from "src/dtos/register-user.dto";
import { Logger } from "@nestjs/common";

@Injectable()
export class RegisterUserUseCase {
  private readonly logger = new Logger("RegisterUserUseCase");

  constructor(private readonly userRepository: UserRepository) {}

  async execute(RegisterUserDto: RegisterUserDto): Promise<string> {
    const { user, email, password, name, rut } = RegisterUserDto;

    try {
      const userEntity = new User(user, email, password, name, rut);

      await this.userRepository.createUser(userEntity);

      return "Usuario registrado correctamente";
    } catch (e) {
      this.logger.error("Error al registrar el usuario", e.stack);
      throw new Error("Error al registrar el usuario verifique sus datos");
    }
  }
}
