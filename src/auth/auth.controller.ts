import { Controller, Post, Body, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterUserDto } from "src/dtos/register-user.dto";
import { Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const message = await this.authService.register(registerUserDto);
      res.json({ message });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  @Post("verifyToken")
  async verifyToken(@Body() token: string): Promise<any> {
    return this.authService.verifyUser(token);
  }
}
