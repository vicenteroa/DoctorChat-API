import { User } from "src/entities/user/user";

export class RegisterUserUseCase {
  execute(user: User): void {
    if (!user.isValid()) {
      console.log(`Failed to register user: ${user}`);
      throw new Error("Usuario Inválido");
    } else {
      console.log(`User is valid: ${user}`);
    }
  }
}
