import { Injectable } from "@nestjs/common";
import { FirebaseService } from "src/services/firebase/firebase.service";

@Injectable()
export class CitasService {
  constructor(private firebaseService: FirebaseService) {}

  async registerCitas(user_uid: string, doctor_uid: string, fecha: string) {
    return this.firebaseService.createCitasStore(user_uid, fecha, doctor_uid);
  }
}
