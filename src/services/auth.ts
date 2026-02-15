import { Auth } from "../model/auth.js";
import { AuthRepository } from "../repository/auth.js";
import argon2 from "argon2";

type AuthServiceReturn = {
  message: string;
  status: "success" | "error";
  data: Auth | null;
  error?: unknown;
};
type AuthSearchInput = Partial<Pick<Auth, "username" | "id">>;
export class AuthService {
  private authRepo = new AuthRepository();
  async createUser(
    input: Pick<Auth, "username" | "password">,
  ): Promise<AuthServiceReturn> {
    try {
      const usernameExists = await this.authRepo.findByUsername(input.username);

      if (usernameExists) {
        return {
          message: "Username already exists!",
          status: "error",
          data: null,
        };
      }

      const hashPassword = await argon2.hash(input.password);

      const result = await this.authRepo.create(input.username, hashPassword);

      if (result != null) {
        return {
          message: "User created successfully",
          status: "success",
          data: result,
        };
      }
    } catch (error: unknown) {
      return {
        message: "Internal error in auth create",
        status: "error",
        data: null,
        // Idk how it sends error but stack overflow had it, idk sybau.
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async findUser(input: AuthSearchInput): Promise<AuthServiceReturn> {
    try {
      let checkUser;

      if (input.id) {
        checkUser = await this.authRepo.findByID(input.id);
      } else if (input.username) {
        checkUser = await this.authRepo.findByUsername(input.username);
      } else {
        return {
          message: "No search parameter provided",
          status: "error",
          data: null,
        };
      }

      if (!checkUser) {
        return {
          message: "No user found with the given parameter",
          status: "error",
          data: null,
        };
      }

      return {
        message: "User found",
        status: "success",
        data: checkUser,
      };
    } catch (err) {
      console.error("findUser error:", err);
      return {
        message: "Internal Server Error",
        status: "error",
        data: null,
      };
    }
  }
}
