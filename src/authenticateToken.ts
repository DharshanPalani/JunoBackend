import jwt, { TokenExpiredError } from "jsonwebtoken";
import dotenv from "dotenv";
import type { Request, Response, NextFunction } from "express";

dotenv.config();

interface AuthRequest extends Request {
  user?: jwt.JwtPayload | string;
}

const authenticateToken = (
  request: AuthRequest,
  response: Response,
  next: NextFunction,
) => {
  const accessToken = request.cookies?.accessToken;
  const secretKey = process.env.TOKEN_SECRET_KEY;

  if (!accessToken) {
    return response.status(401).json({ error: "No token provided" });
  }

  if (!secretKey) {
    console.error("TOKEN_SECRET_KEY is not defined in environment variables");
    return response.status(500).json({ error: "Server configuration error" });
  }

  try {
    const decoded = jwt.verify(accessToken, secretKey) as
      | jwt.JwtPayload
      | string;
    request.user = decoded;
    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return response.status(401).json({ error: "Access token expired" });
    }
    return response.status(403).json({ error: "Invalid token" });
  }
};

export default authenticateToken;
