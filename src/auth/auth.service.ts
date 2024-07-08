import * as admin from "firebase-admin";
import { Injectable } from "@nestjs/common";
import { RegisterUserUseCase } from "src/use_cases/register-user/register-user";
import { RegisterUserDto } from "src/dtos/register-user.dto";
import { FirebaseService } from "src/firebaseConfig";
import { User } from "src/entities/user/user";

@Injectable()
export class AuthService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly registerUserUseCase: RegisterUserUseCase,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<void> {
    const { user, email, password, name, rut } = registerUserDto;

    try {
      const userEntity = new User(user, email, password, name, rut);

      this.registerUserUseCase.execute(userEntity);

      // Registrar en Firebase Authentication
      const userCredential = await this.firebaseService.getAuth().createUser({
        email: userEntity.email,
        password: userEntity.password,
      });

      const userId = userCredential.uid;

      // Registrar en Firestore
      const firestoreUser = {
        id: userId,
        rut: userEntity.rut,
        email: userEntity.email,
        name: userEntity.name,
      };

      await this.firebaseService
        .getFirestore()
        .collection("users")
        .doc(userId)
        .set(firestoreUser);
    } catch (error) {
      throw new Error(`Failed to register user: ${error.message}`);
    }
  }

  async verifyUser(token: string): Promise<admin.auth.DecodedIdToken> {
    try {
      const decodedToken = await this.firebaseService
        .getAuth()
        .verifyIdToken(token);
      return decodedToken;
    } catch (error) {
      throw new Error(`Failed to verify user: ${error.message}`);
    }
  }
}
