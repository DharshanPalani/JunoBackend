import type { Request, Response } from "express";
import { AuthService } from "../services/auth.js";
import argon2 from "argon2";

export class AuthController {
  private authService = new AuthService();

  async register(request: Request, response: Response) {
    try {
      const { username, password } = request.body;

      const result = await this.authService.createUser({ username, password });

      response
        .status(result.status == "success" ? 201 : 409)
        .json({ message: result.message, data: result.data });
    } catch (error: unknown) {
      response.status(500).json({ message: "Internal Server Error" });
    }
  }

  async login(request: Request, response: Response) {
    try {
      const { username, password } = request.body;
      const isUserExists = await this.authService.findUser({ username });

      if (isUserExists.status == "error") {
        return response.status(404).json({ message: isUserExists.message });
      }

      const verifyPassword = await argon2.verify(
        isUserExists.data.password,
        password,
      );

      if (verifyPassword == false) {
        return response
          .status(401)
          .json({ message: "Invalid or false password!" });
      }

      return response.status(202).json({ message: "Login success!" });
    } catch (error: unknown) {
      response.status(500).json({ message: "Internal Server Error" });
    }
  }
}
