import { EventController } from "./event.controller.ts";
import express from "express";

const eventController = new EventController();

const eventRouter = express.Router();

eventRouter.post(
  "/event/register",
  eventController.register.bind(eventController),
);

eventRouter.get("/event/:event_id", eventController.find.bind(eventController));

export default eventRouter;
