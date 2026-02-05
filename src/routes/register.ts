import { Router } from "express";
import { RegisterController } from "../controller/register.js";
import { authMiddleware } from "../middlewares/auth.js";
import multer from "multer";
import { ParticipantsPaymentController } from "../controller/participantsPayment.js";

const registerController = new RegisterController();
const participantsPaymentController = new ParticipantsPaymentController();
const registerRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

registerRouter.post(
  "/register",
  authMiddleware,
  registerController.register.bind(registerController),
);

registerRouter.post(
  "/register/payment",
  authMiddleware,
  upload.single("image"),
  participantsPaymentController.uploadScreenshot.bind(
    participantsPaymentController,
  ),
);

registerRouter.get(
  "/register/payment/status",
  authMiddleware,
  participantsPaymentController.paymentStatus.bind(
    participantsPaymentController,
  ),
);

registerRouter.get(
  "/registrations/:day_id",
  authMiddleware,
  registerController.registrations.bind(registerController),
);

export default registerRouter;
