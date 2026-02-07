import { Router } from "express";
import { AdminController } from "../controller/admin.js";

const adminController = new AdminController();
const adminRouter = Router();

adminRouter.get(
  "/registrations",
  adminController.fetchRegistrations.bind(adminController),
);

export default adminRouter;
