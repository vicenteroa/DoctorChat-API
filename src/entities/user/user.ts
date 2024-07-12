export class User {
  constructor(
    public user: string,
    public email: string,
    public password: string,
    public name: string,
    public rut: string,
  ) {}

  isValid(): boolean {
    const isEmailValid = this.EmailIsValid();
    const isPasswordValid = this.PasswordIsValid();

    return isEmailValid && isPasswordValid;
  }

  EmailIsValid(): boolean {
    const isValid = this.email.match(/^\S+@\S+\.\S+$/) !== null;
    if (!isValid) {
    }
    return isValid;
  }

  PasswordIsValid(): boolean {
    const isValid = this.password.length >= 6;
    if (!isValid) {
    }
    return isValid;
  }
}
