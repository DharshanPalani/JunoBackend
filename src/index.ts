import express from "express";
import authRouter from "./routes/auth.js";
import dayRouter from "./routes/day.js";
import eventRouter from "./routes/event.js";
import registerRouter from "./routes/register.js";

import cors from "cors";
import passport from "passport";
import schemaExecutor from "./schemaExecutor.js";

import "./auth/passportSetup.js";
import cookieParser from "cookie-parser";

const app = express();

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
  }),
);

app.use(cookieParser());
app.use(passport.initialize());

schemaExecutor(true);

app.use("/auth", authRouter);
app.use("/event", registerRouter);
app.use("/admin", dayRouter);
app.use("/admin", eventRouter);

app.get("/", (_req, res) => {
  res.send("Hello from backend!");
});

export default app;
