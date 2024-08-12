import { User } from "./user";

describe("User Class", () => {
  it("should create an instance of User valid inputs", () => {
    expect(
      () =>
        new User(
          "username",
          "email@email.com",
          "password",
          "name",
          "212877751",
        ),
    ).not.toThrow();
  });

  it("should throw an error if the email is invalid", () => {
    expect(
      () => new User("username", "email", "password", "name", "212877751"),
    ).toThrow("Email inválido");
  });

  it("should throw an error if the rut is invalid", () => {
    expect(
      () =>
        new User("username", "email@email.com", "password", "name", "21287775"),
    ).toThrow("Invalid RUT digit verifier");
  });
});
