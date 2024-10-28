import { Injectable } from "@nestjs/common";
import * as admin from "firebase-admin";
import { User } from "src/entities/user/user";
import { ConfigService } from "@nestjs/config";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class FirebaseService {
  private firebaseApp: admin.app.App;

  constructor(private configService: ConfigService) {
    if (admin.apps.length === 0) {
      const firebaseConfig = {
        projectId: this.configService.get<string>("FIREBASE_PROJECTID"),
        clientEmail: this.configService.get<string>("FIREBASE_CLIENT_EMAIL"),
        storageBucket: this.configService.get<string>("FIREBASE_STORAGEBUCKET"),
        privateKey: this.configService
          .get<string>("FIREBASE_PRIVATE_KEY")
          ?.replace(/\\n/g, "\n"),
      };

      // Inicializa la aplicación de Firebase
      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(firebaseConfig),
        storageBucket: firebaseConfig.storageBucket,
      });
    } else {
      // Usa la instancia existente
      this.firebaseApp = admin.apps[0];
    }
  }

  getAuth() {
    return this.firebaseApp.auth();
  }

  getFirestore() {
    return this.firebaseApp.firestore();
  }

  getStorage() {
    return admin.storage(); // Agregar este método para acceder al almacenamiento
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

  async copyFileToStorage(
    sourcePath: string,
    destinationPath: string,
  ): Promise<void> {
    const bucket = this.getStorage().bucket(); // Obtener el bucket
    await bucket.file(sourcePath).copy(destinationPath);
  }

  async deleteFileFromStorage(filePath: string): Promise<void> {
    const bucket = this.getStorage().bucket();
    await bucket.file(filePath).delete();
  }
  async uploadFile(filePath: string, destinationPath: string): Promise<string> {
    const bucket = this.getStorage().bucket();
    const token = uuidv4();

    await bucket.upload(filePath, {
      destination: destinationPath,
      metadata: {
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        metadata: {
          firebaseStorageDownloadTokens: token,
        },
      },
    });

    return destinationPath;
  }
  async downloadFile(
    sourcePath: string,
    destinationPath: string,
  ): Promise<void> {
    const bucket = this.getStorage().bucket();
    await bucket.file(sourcePath).download({ destination: destinationPath });
  }
  async checkFileExists(filePath: string): Promise<boolean> {
    const bucket = this.getStorage().bucket();
    const file = bucket.file(filePath);
    const [exists] = await file.exists();
    return exists;
  }
  async getDownloadURL(filePath: string): Promise<string> {
    const bucket = this.getStorage().bucket();
    const file = bucket.file(filePath);
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 1000 * 60 * 60,
    });
    return url;
  }
}
