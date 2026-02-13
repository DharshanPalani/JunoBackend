import type { Request, Response } from "express";
import { AuthService } from "../services/auth.js";

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
}
