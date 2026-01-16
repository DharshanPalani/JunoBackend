import express from "express";
import authRouter from "./routes/auth.js";
import dayRouter from "./routes/day.js";
import eventRouter from "./routes/event.js";
import registerRouter from "./routes/register.js";

import session from "express-session";
import pgSession from "connect-pg-simple";
import cors from "cors";
import pool from "./db.js";
import passport from "passport";
import schemaExecutor from "./schemaExecutor.js";

import "./auth/passportSetup.js";

const app = express();
const PgSession = pgSession(session);

const allowedOrigins = [
  "https://juno-frontend-staging.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("CORS not allowed GET OU-"));
    },
    credentials: true,
  })
);

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
  })
);

app.use(passport.initialize());
app.use(passport.session());

schemaExecutor(true);

app.use("/auth", authRouter);
app.use("/event", registerRouter);
app.use("/admin", dayRouter);
app.use("/admin", eventRouter);

app.get("/", (_req, res) => {
  res.send("Hello from backend!");
});

export default app;
