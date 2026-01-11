import express from "express";
import type { Request, RequestHandler, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import schemaExecutor from "./schemaExecutor";

import registerRouter from "./modules/register/register.routes";

import dayRouter from "./modules/day/day.routes";
import eventRouter from "./modules/event/event.routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser() as RequestHandler);

schemaExecutor(true);

app.use("/event", registerRouter);

app.use("/admin", dayRouter);
app.use("/admin", eventRouter);

app.use("/", (request: Request, response: Response) => {
  response.send("Hello, world daw!");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
