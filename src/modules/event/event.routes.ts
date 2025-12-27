import { Router } from "express";
import { EventController } from "./event.controller.ts";

const eventController = new EventController();
const eventRouter = Router();

eventRouter.post("/register", eventController.register.bind(eventController));

export default eventRouter;
