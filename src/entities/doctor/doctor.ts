import { User } from "src/entities/user/user";

export class Doctor extends User {
  constructor(
    id: string,
    email: string,
    password: string,
    name: string,
    rut: string,
    public specialist: string,
  ) {
    super(id, email, password, name, rut);
  }
}
