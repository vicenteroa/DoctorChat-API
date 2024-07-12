import { User } from "src/entities/user/user";

export class RegisterUserUseCase {
  execute(user: User): string {
    if (!user.isValid()) {
      throw new Error("Usuario Inválido");
    } else {
      return "Usuario registrado";
    }
  }
}
