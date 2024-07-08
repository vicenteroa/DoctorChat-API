import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterUserDto } from "src/dtos/register-user.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() registerUserDto: RegisterUserDto): Promise<void> {
    await this.authService.register(registerUserDto);
  }

  @Post("verifyToken")
  async verifyToken(@Body() token: string): Promise<any> {
    return this.authService.verifyUser(token);
  }
}
