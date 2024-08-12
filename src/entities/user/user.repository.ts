import { Injectable } from "@nestjs/common";
import { User } from "src/entities/user/user";
import { FirebaseService } from "src/services/firebase/firebase.service";

@Injectable()
export class UserRepository {
  constructor(private readonly firebaseService: FirebaseService) {}

  async createUser(user: User): Promise<void> {
    try {
      // Registrar en Firebase Authentication
      const userCredential = await this.firebaseService.createUserAuth(user);
      const userId = userCredential.uid;

      if (!userId) {
        throw new Error("No se recibió un ID de usuario válido.");
      }
      // Registrar en Firestore
      const userStore = new User(
        user.user,
        user.email,
        user.password,
        user.name,
        user.rut,
      );
      userStore.id = userId;
      await this.firebaseService.createUserStore(userStore);
    } catch (error) {
      throw new Error("Error al crear el usuario: " + error.message);
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      const userData = await this.firebaseService.getUserFromFirestore(userId);
      if (!userData) return null;
      return new User(
        userData.id,
        userData.email,
        "",
        userData.name,
        userData.rut,
      );
    } catch (error) {
      throw new Error("Error al obtener el usuario: " + error.message);
    }
  }

  async updateUser(userId: string, updateData: Partial<User>): Promise<void> {
    try {
      await this.firebaseService.updateUserInFirestore(userId, updateData);
    } catch (error) {
      throw new Error("Error al actualizar el usuario: " + error.message);
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await this.firebaseService.deleteUser(userId);
      await this.firebaseService.deleteUserFromFirestore(userId);
    } catch (error) {
      throw new Error("Error al eliminar el usuario: " + error.message);
    }
  }
}
