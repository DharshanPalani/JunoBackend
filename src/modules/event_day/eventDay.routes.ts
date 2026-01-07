import { Router } from "express";
import { EventDayController } from "./eventDay.controller";

const eventDayController = new EventDayController();
const eventRouter = Router();

eventRouter.post(
  "/day/register",
  eventDayController.registerDay.bind(eventDayController),
);

export default eventRouter;
