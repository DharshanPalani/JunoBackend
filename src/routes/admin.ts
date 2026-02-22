import { Router } from "express";
import { AdminController } from "../controller/admin.js";
import dayRouter from "./day.js";
import eventRouter from "./event.js";
import { adminRequireSession } from "../middlewares/adminAuth.js";

const adminController = new AdminController();
const adminRouter = Router();

adminRouter.use("/day", dayRouter);
adminRouter.use("/event", eventRouter);

adminRouter.get(
  "/registrations",
  adminRequireSession,
  adminController.fetchRegistrations.bind(adminController),
);

adminRouter.get(
  "/registrations/deletedData",
  adminRequireSession,
  adminController.fetchDeletedRegistration.bind(adminController),
);

adminRouter.post(
  "/delete",
  adminRequireSession,
  adminController.deleteRegistration.bind(adminController),
);

adminRouter.post(
  "/registrations/recover",
  adminRequireSession,
  adminController.recoverDeletedRegistrations.bind(adminController),
);

adminRouter.post(
  "/registrations/update",
  adminRequireSession,
  adminController.updateRegistration.bind(adminController),
);

adminRouter.get("/ping", (_req, res) => {
  res.send("ADMIN OK");
});

export default adminRouter;
