import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as admin from "firebase-admin";

@Injectable()
export class FirebaseService {
  private firebaseApp: admin.app.App;

  constructor(private configService: ConfigService) {
    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: this.configService.get<string>("FIREBASE_PROJECTID"),
        clientEmail: this.configService.get<string>("FIREBASE_CLIENT_EMAIL"),
        privateKey: this.configService
          .get<string>("FIREBASE_PRIVATE_KEY")
          .replace(/\\n/g, "\n"),
      }),
    });
  }

  getAuth() {
    return this.firebaseApp.auth();
  }

  getFirestore() {
    return this.firebaseApp.firestore();
  }
}
