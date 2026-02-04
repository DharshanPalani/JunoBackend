import { ParticipantsPaymentRepository } from "../repository/participantsPayment.js";
import { ParticipantsPayments } from "../model/participantsPayment.js";

type ParticipantsPaymentServiceReturn = {
  participantsPayment: ParticipantsPayments | null;
  status: "success" | "error";
  error?: string;
};

export class ParticipantsPaymentService {
  private repo = new ParticipantsPaymentRepository();

  async createOrFindPaymentEntry(
    registration_id: number,
  ): Promise<ParticipantsPaymentServiceReturn> {
    try {
      const existing = await this.repo.find({ registration_id });

      if (existing) {
        return {
          status: "success",
          participantsPayment: existing,
        };
      }

      const created = await this.repo.create({ registration_id });

      return {
        status: "success",
        participantsPayment: created,
      };
    } catch (err) {
      return {
        status: "error",
        participantsPayment: null,
        error: "Failed to create payment",
      };
    }
  }

  async markPaymentDone(payment_id: number, screenshotPath: string) {
    try {
      const payment = await this.repo.find({ registration_id: payment_id });

      if (!payment) {
        return {
          status: "error",
          participantsPayment: null,
          error: payment_id,
        };
      }

      if (payment.status !== "NO_PAYMENT") {
        return {
          status: "error",
          participantsPayment: null,
          error: "Payment already processed",
        };
      }

      const updated = await this.repo.update({
        id: payment_id,
        status: "PAYMENT_DONE",
        payment_screenshot: screenshotPath,
      });

      return {
        status: "success",
        participantsPayment: updated,
      };
    } catch (err) {
      return {
        status: "error",
        participantsPayment: null,
        error: err.message,
      };
    }
  }

  async verify(payment_id: number): Promise<ParticipantsPaymentServiceReturn> {
    try {
      const payment = await this.repo.find({ id: payment_id });

      if (!payment) {
        return {
          status: "error",
          participantsPayment: null,
          error: "Payment not found",
        };
      }

      if (payment.status !== "PAYMENT_DONE") {
        return {
          status: "error",
          participantsPayment: null,
          error: "Payment not ready for verification",
        };
      }

      const updated = await this.repo.update({
        id: payment_id,
        status: "VERIFIED_PAYMENT",
      });

      return {
        status: "success",
        participantsPayment: updated,
      };
    } catch {
      return {
        status: "error",
        participantsPayment: null,
        error: "Verification failed",
      };
    }
  }
}
