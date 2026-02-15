import type { Request, Response, NextFunction } from "express";
import redisClient from "../utils/redisClient.js";

export interface AdminAuthRequest extends Request {
  userId?: string;
}

export async function adminRequireSession(
  req: AdminAuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const sessionId = req.cookies?.session;

    if (!sessionId) {
      return res.status(401).json({ message: "No session cookie" });
    }

    const rawUserId = await redisClient.get(`session:${sessionId}`);
    if (!rawUserId) {
      return res.status(401).json({ message: "Invalid or expired session" });
    }

    const userId =
      typeof rawUserId === "string" ? rawUserId : rawUserId.toString("utf-8");

    req.userId = userId;
    next();
  } catch (err) {
    console.error("Session middleware error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
