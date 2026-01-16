import { Router } from "express";
import { DayController } from "./day.controller.ts";

const dayController = new DayController();
const dayRouter = Router();

dayRouter.post("/day/register", dayController.registerDay.bind(dayController));

dayRouter.get("/day/:day_id", dayController.findDay.bind(dayController));

export default dayRouter;
