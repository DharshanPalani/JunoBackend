import type { Request, Response } from "express";
import { AuthService } from "../services/auth.js";
import argon2 from "argon2";

import redisClient from "../utils/redisClient.js";
import { v4 as uuidv4 } from "uuid";
import { AdminAuthRequest } from "../middlewares/adminAuth.js";

export class AuthController {
  private authService = new AuthService();

  async register(request: Request, response: Response) {
    try {
      const { username, password } = request.body;

      const result = await this.authService.createUser({ username, password });

      response
        .status(result.status == "success" ? 201 : 409)
        .json({ message: result.message, data: result.user });
    } catch (error: unknown) {
      response.status(500).json({ message: "Internal Server Error" });
    }
  }

  async login(request: Request, response: Response) {
    try {
      const { username, password } = request.body;
      const isUserExists = await this.authService.findUser({
        username: username,
      });

      if (isUserExists.status == "error") {
        return response.status(404).json({ message: isUserExists.message });
      }

      const verifyPassword = await argon2.verify(
        isUserExists.user.password,
        password,
      );

      if (verifyPassword == false) {
        return response
          .status(401)
          .json({ message: "Invalid or false password!" });
      }

      const uuid = uuidv4();

      await redisClient.set(`code:${uuid}`, isUserExists.user.id, {
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
      if (!checkCode) {
        return response.status(402).send("Invalid CODE");
      }

      // This is just making sure the code is a string, if it ain't then it converts to string.
      const userId =
        typeof checkCode === "string" ? checkCode : checkCode.toString("utf-8");

      await redisClient.del(`code:${code}`);

      const sessionId = uuidv4();

      await redisClient.set(`session:${sessionId}`, userId, {
        EX: 7 * 24 * 60 * 60,
      });

      response
        .status(202)
        .cookie("session", sessionId, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 7 * 24 * 60 * 60 * 1000,
          path: "/",
        })
        .json({ message: "Exchanged successfully!" });
    } catch (error) {
      response.status(500).json({ message: "Internal Server Error" });
    }
  }

  async getAdminSelf(req: AdminAuthRequest, res: Response) {
    try {
      const userId = req.userId;

      const id = parseInt(userId);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user id" });
      }

      const result = await this.authService.findUser({ id: id });

      if (!result || result.status === "error") {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "User retrieved successfully",
        user: {
          id: result.user.id,
          username: result.user.username,
        },
      });
    } catch (err) {
      console.error("GET /auth/me error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
