import { Injectable } from "@nestjs/common";
import * as admin from "firebase-admin";
import { User } from "src/entities/user/user";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class FirebaseService {
  private firebaseApp: admin.app.App;

  constructor(private configService: ConfigService) {
    const firebaseConfig = {
      projectId: this.configService.get<string>("FIREBASE_PROJECTID"),
      clientEmail: this.configService.get<string>("FIREBASE_CLIENT_EMAIL"),
      privateKey: this.configService
        .get<string>("FIREBASE_PRIVATE_KEY")
        ?.replace(/\\n/g, "\n"),
    };

    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
    });
  }

  getAuth() {
    return this.firebaseApp.auth();
  }

  getFirestore() {
    return this.firebaseApp.firestore();
  }

  async createUserStore(user: User): Promise<void> {
    const firestoreUser = {
      id: user.id,
      user: user.user,
      rut: user.rut,
      password: user.password,
      email: user.email,
      name: user.name,
    };
    await this.getFirestore()
      .collection("users")
      .doc(user.id)
      .set(firestoreUser);
  }

  async createUserAuth(user: User): Promise<admin.auth.UserRecord> {
    return this.getAuth().createUser({
      email: user.email,
      password: user.password,
    });
  }

  async getUser(userId: string): Promise<admin.auth.UserRecord> {
    return this.getAuth().getUser(userId);
  }

  async updateUser(
    userId: string,
    updates: Partial<admin.auth.UpdateRequest>,
  ): Promise<admin.auth.UserRecord> {
    return this.getAuth().updateUser(userId, updates);
  }

  async deleteUser(userId: string): Promise<void> {
    return this.getAuth().deleteUser(userId);
  }

  async verifyToken(token: string): Promise<admin.auth.DecodedIdToken> {
    return this.getAuth().verifyIdToken(token);
  }

  async getUserFromFirestore(userId: string): Promise<any> {
    const doc = await this.getFirestore().collection("users").doc(userId).get();
    return doc.exists ? doc.data() : null;
  }

  async updateUserInFirestore(
    userId: string,
    updateData: any,
  ): Promise<admin.firestore.WriteResult> {
    return this.getFirestore()
      .collection("users")
      .doc(userId)
      .update(updateData);
  }

  async deleteUserFromFirestore(
    userId: string,
  ): Promise<admin.firestore.WriteResult> {
    return this.getFirestore().collection("users").doc(userId).delete();
  }
}
