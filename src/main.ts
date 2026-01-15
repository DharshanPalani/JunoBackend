import express from "express";
import type { Request, RequestHandler, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import schemaExecutor from "./schemaExecutor";
import passport from "passport";
import pgSession from "connect-pg-simple";
import pool from "./db";
import "./modules/googleOAuth/passportSetup";

import authRouter from "./modules/auth/auth.routes";
import registerRouter from "./modules/register/register.routes";

import dayRouter from "./modules/day/day.routes";
import eventRouter from "./modules/event/event.routes";

const app = express();
const PgSession = pgSession(session);

app.use(
  cors({
    origin: "https://juno-frontend-staging.vercel.app",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser() as RequestHandler);
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
      secure: true,
      sameSite: "none",
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
