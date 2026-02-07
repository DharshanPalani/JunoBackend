import { Router } from "express";
import { AdminController } from "../controller/admin.js";
import dayRouter from "./day.js";
import eventRouter from "./event.js";

const adminController = new AdminController();
const adminRouter = Router();

adminRouter.use("/day", dayRouter);
adminRouter.use("/event", eventRouter);

adminRouter.get(
  "/registrations",
  adminController.fetchRegistrations.bind(adminController),
);

export default adminRouter;
