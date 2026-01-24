import { Router } from "express";
import { RegisterController } from "../controller/register.js";
import { authMiddleware } from "../middlewares/auth.js";

const registerController = new RegisterController();
const registerRouter = Router();

registerRouter.post(
  "/register",
  authMiddleware,
  registerController.register.bind(registerController),
);

registerRouter.get(
  "/registrations/:day_id",
  authMiddleware,
  registerController.registrations.bind(registerController),
);

export default registerRouter;
