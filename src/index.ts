import express from "express";
import authRouter from "./routes/auth.js";
import registerRouter from "./routes/register.js";
import profileRouter from "./routes/profile.js";
import adminRouter from "./routes/admin.js";

import cors from "cors";
import passport from "passport";
import schemaExecutor from "./schemaExecutor.js";

import "./auth/passportSetup.js";
import cookieParser from "cookie-parser";

const app = express();

const allowedOrigins = [
  "https://juno-frontend-staging.vercel.app",
  "https://juno2k26.vercel.app",
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

// app.use(
//   cors({
//     origin: "https://juno-frontend-staging.vercel.app",
//     credentials: true,
//   }),
// );

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

schemaExecutor(true);

app.use("/auth", authRouter);
app.use("/event", registerRouter);

app.use("/admin", adminRouter);
app.use("/profile", profileRouter);

app.get("/", (_req, res) => {
  res.send("Health check done!");
});

export default app;
