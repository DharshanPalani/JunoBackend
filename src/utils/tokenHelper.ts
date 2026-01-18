import jwt from "jsonwebtoken";

export function signAccessToken(participantId: number) {
  return jwt.sign(
    { sub: participantId, type: "access" },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "10m" },
  );
}

export function signRefreshToken(participantId: number) {
  return jwt.sign(
    { sub: participantId, type: "refresh" },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: "28d" },
  );
}
