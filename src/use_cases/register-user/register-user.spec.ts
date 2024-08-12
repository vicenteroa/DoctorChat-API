import { Test, TestingModule } from "@nestjs/testing";
import { ConfigModule } from "@nestjs/config";
import { RegisterUserUseCase } from "src/use_cases/register-user/register-user";
import { UserRepository } from "src/entities/user/user.repository";
import { User } from "src/entities/user/user";
import { RegisterUserDto } from "src/dtos/register-user.dto";

describe("RegisterUserUseCase", () => {
  let useCase: RegisterUserUseCase;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ envFilePath: ".env.test" })],
      providers: [
        RegisterUserUseCase,
        {
          provide: UserRepository,
          useValue: {
            createUser: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<RegisterUserUseCase>(RegisterUserUseCase);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe("execute", () => {
    it("should register a user and store it in Firebase and Firestore", async () => {
      const validUserDto: RegisterUserDto = {
        user: "user",
        email: "email@example.com",
        password: "password123",
        name: "Name",
        rut: "21287775-1",
      };

      jest.spyOn(userRepository, "createUser").mockResolvedValue(undefined);

      await expect(useCase.execute(validUserDto)).resolves.toEqual(
        "Usuario registrado correctamente",
      );

      expect(userRepository.createUser).toHaveBeenCalledWith(expect.any(User));
    });

    it("should throw an error if Firebase authentication fails", async () => {
      const validUserDto: RegisterUserDto = {
        user: "user",
        email: "email@example.com",
        password: "password123",
        name: "Name",
        rut: "21287775-1",
      };

      jest
        .spyOn(userRepository, "createUser")
        .mockRejectedValue(new Error("Auth Error"));

      await expect(useCase.execute(validUserDto)).rejects.toThrow(
        "Error al registrar el usuario verifique sus datos",
      );
    });

    it("should throw an error if Firestore store fails", async () => {
      const validUserDto: RegisterUserDto = {
        user: "user",
        email: "email@example.com",
        password: "password123",
        name: "Name",
        rut: "21287775-1",
      };

      jest
        .spyOn(userRepository, "createUser")
        .mockRejectedValue(new Error("Store Error"));

      await expect(useCase.execute(validUserDto)).rejects.toThrow(
        "Error al registrar el usuario verifique sus datos",
      );
    });
  });
});
