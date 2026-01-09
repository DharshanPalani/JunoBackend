import { Router } from "express";
import { RegisterController } from "./register.controller";

const registerController = new RegisterController();
const registerRouter = Router();

registerRouter.post(
  "/register",
  registerController.register.bind(registerController),
);

export default registerRouter;
