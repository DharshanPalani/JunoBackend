import { Router } from "express";
import { EventDayController } from "./eventDay.controller";

const eventDayController = new EventDayController();
const eventDayRouter = Router();

eventDayRouter.post(
  "/day/register",
  eventDayController.registerDay.bind(eventDayController),
);

eventDayRouter.get(
  "/day/:day_id",
  eventDayController.findDay.bind(eventDayController),
);

export default eventDayRouter;
