import type { Request, Response } from "express";
import { ParticipantsPaymentService } from "../services/participantsPayment.js";
import { AuthRequest } from "../middlewares/auth.js";
import { RegistrationService } from "../services/registration.js";
import supabaseClient from "../utils/supabseClient.js";
import crypto from "crypto";

export class ParticipantsPaymentController {
  private participantsPayment = new ParticipantsPaymentService();
  private registration = new RegistrationService();

  async uploadScreenshot(request: AuthRequest, response: Response) {
    try {
      const participant = request.user;
      const day_id = request.body.day_id;

      const participantRegistration = await this.registration.findRegistry(
        participant.id,
        day_id,
      );

      if (!request.file) {
        return response.status(400).json({ error: "No image uploaded" });
      }

      const ext = request.file.originalname.split(".").pop()?.toLowerCase();
      const allowedExts = ["png", "jpg", "jpeg", "webp"];

      if (!ext || !allowedExts.includes(ext)) {
        console.log("Rejected file:", request.file.originalname);
        return response.status(400).json({ error: "Invalid file type" });
      }

      const filePath = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabaseClient.storage
        .from("payment_screenshots")
        .upload(filePath, request.file.buffer, {
          contentType: request.file.mimetype || `image/${ext}`,
          upsert: false,
        });

      if (uploadError) {
        return response.status(500).json({ error: uploadError.message });
      }

      const result = await this.participantsPayment.markPaymentDone(
        participantRegistration.id,
        filePath,
      );

      if (result.status != "success") {
        response.status(409).json({
          message: "Issue with updating payment proof in the entry",
          error: result.error,
        });
      }
      response
        .status(201)
        .json({ message: "Payment Screenshot Uploaded Successfully!" });
    } catch (error) {
      response.status(500).send(error);
    }
  }

  async paymentStatus(req: AuthRequest, res: Response) {
    const participant = req.user;
    const day_id = Number(req.query.day_id);

    if (!day_id) {
      return res.status(400).json({ code: "DAY_ID_REQUIRED" });
    }

    const registration = await this.registration.findRegistry(
      participant.id,
      day_id,
    );

    if (!registration) {
      return res.status(200).json({
        state: "NOT_REGISTERED",
      });
    }

    const { participantsPayment } =
      await this.participantsPayment.createOrFindPaymentEntry(registration.id);

    return res.status(200).json({
      state: participantsPayment.status,
    });
  }
}
