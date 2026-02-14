import type { Request, Response } from "express";
import { AuthService } from "../services/auth.js";
import argon2 from "argon2";

import redisClient from "../utils/redisClient.js";
import { v4 as uuidv4 } from "uuid";

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

      const uuid = uuidv4();

      await redisClient.set(`code:${uuid}`, isUserExists.data.id, {
        EX: 67,
      });

      const redirectUrl = `${process.env.ADMIN_DASHBOARD_FRONTEND_URL}/auth/success?code=${uuid}`;
      return response.status(200).json({
        message: "Login success!",
        redirectUrl,
      });
    } catch (error: unknown) {
      response.status(500).json({ message: "Internal Server Error" });
    }
  }

  async exchange(request: Request, response: Response) {
    try {
      const { code } = request.body;
      const checkCode = await redisClient.get(`code:${code}`);

      if (checkCode != null) {
        await redisClient.del(`code:${code}`);
        response
          .status(202)
          .cookie("test", checkCode, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 15 * 60 * 1000,
            path: "/",
          })
          .json({ message: "Exchanged successfully!" });
      } else {
        response.status(402).send("Invalid CODE");
      }
    } catch (error: unknown) {
      response.status(500).json({ message: "Internal Server Error" });
    }
  }
}
