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
    no_create?: boolean,
  ): Promise<ParticipantsPaymentServiceReturn> {
    try {
      const existing = await this.repo.find({ registration_id });

      if (existing) {
        return {
          status: "success",
          participantsPayment: existing,
        };
      }

      if (no_create) {
        return;
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

  async markPaymentDone(registration_id: number, screenshotPath: string) {
    try {
      const payment = await this.repo.find({
        registration_id,
      });

      if (!payment) {
        return {
          status: "error",
          participantsPayment: null,
          error: "Error here ngl",
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
        id: payment.id,
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

  async updatePaymentAdmin(input: {
    registration_id: number;
    transaction_id?: string;
    status?: ParticipantsPayments["status"];
  }) {
    try {
      const payment = await this.repo.find({
        registration_id: input.registration_id,
      });

      if (!payment) {
        return {
          status: "error",
          participantsPayment: null,
          error: "Payment entry not found",
        };
      }

      if (input.transaction_id) {
        const existingTransaction = await this.repo.findByTransactionId(
          input.transaction_id,
        );

        if (
          existingTransaction &&
          existingTransaction.registration_id !== input.registration_id
        ) {
          return {
            status: "error",
            participantsPayment: null,
            error: "Transaction ID already exists",
          };
        }
      }

      const updated = await this.repo.update({
        id: payment.id,
        transaction_id: input.transaction_id,
        status: input.status,
      });

      return {
        status: "success",
        participantsPayment: updated,
      };
    } catch (err: any) {
      return {
        status: "error",
        participantsPayment: null,
        error: err.message,
      };
    }
  }
}
