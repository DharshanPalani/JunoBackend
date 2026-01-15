import express from "express";
import type { Request, RequestHandler, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import schemaExecutor from "./src/schemaExecutor";
import passport from "passport";
import pgSession from "connect-pg-simple";
import pool from "./src/db";
import "./src/googleOAuth/passportSetup";

import authRouter from "./src/auth/auth.routes";
import registerRouter from "./src/register/register.routes";

import dayRouter from "./src/day/day.routes";
import eventRouter from "./src/event/event.routes";

const app = express();
const PgSession = pgSession(session);

const allowedOrigins = [
  "https://juno-frontend-staging.vercel.app",
  "http://localhost:5173",
];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       }
//       callback(new Error("CORS not allowed GET OU-"));
//     },
//     credentials: true,
//   }),
// );

app.use(express.json());
app.use(cookieParser() as RequestHandler);
app.set("trust proxy", 1);
app.use(
  session({
    store: new PgSession({
      pool,
      tableName: "session",
    }),
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 4 * 7 * 24 * 60 * 60 * 1000, // 1 month I think
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

schemaExecutor(true);

app.use("/auth", authRouter);

app.use("/event", registerRouter);

app.use("/admin", dayRouter);
app.use("/admin", eventRouter);

app.use("/", (request: Request, response: Response) => {
  response.send("Hello, world daw!");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
