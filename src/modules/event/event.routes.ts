import { EventController } from "./event.controller";
import express from "express";

const eventController = new EventController();

const eventRouter = express.Router();

eventRouter.post(
  "/event/register",
  eventController.register.bind(eventController),
);

export default eventRouter;
