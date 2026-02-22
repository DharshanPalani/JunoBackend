import { AdminRepository } from "../repository/admin.js";
import { ParticipantsService } from "./participants.js";
import { ParticipantsPaymentService } from "./participantsPayment.js";

type AdminRegistrationReturn = {
  message: string;
  status: "success" | "error";
  data: any | null;
};

export class AdminService {
  private adminRepository = new AdminRepository();
  private participantsPaymentService = new ParticipantsPaymentService();
  private participantsService = new ParticipantsService();

  async fetchRegistrations(): Promise<AdminRegistrationReturn> {
    try {
      const result = await this.adminRepository.getAllRegistration();

      return {
        message: "Fetched Registrations Successfully",
        status: "success",
        data: result,
      };
    } catch (error) {
      return { message: String(error), status: "error", data: null };
    }
  }

  async findByContact(
    contact_number: string,
  ): Promise<AdminRegistrationReturn> {
    try {
      const result =
        await this.adminRepository.getRegistrationByContact(contact_number);

      return {
        message: "Fetched Registrations Successfully",
        status: "success",
        data: result,
      };
    } catch (error) {
      return { message: String(error), status: "error", data: null };
    }
  }

  async softDelete(ids: number[]): Promise<AdminRegistrationReturn> {
    try {
      await Promise.all(ids.map((id) => this.adminRepository.markDelete(id)));

      return { message: "Deleted successfully", status: "success", data: null };
    } catch (error) {
      return { message: String(error), status: "error", data: null };
    }
  }

  async recoverDelete(ids: number[]): Promise<AdminRegistrationReturn> {
    try {
      await Promise.all(
        ids.map((id) => this.adminRepository.recoverDelete(id)),
      );

      return {
        message: "Recovered successfully",
        status: "success",
        data: null,
      };
    } catch (error) {
      return { message: String(error), status: "error", data: null };
    }
  }

  async fetchDeletedRegistrations(): Promise<AdminRegistrationReturn> {
    try {
      const result = await this.adminRepository.getDelete();

      return {
        message: "Fetched deleted Registrations Successfully",
        status: "success",
        data: result,
      };
    } catch (error) {
      return { message: String(error), status: "error", data: null };
    }
  }

  async updateStandbyParticipant(input: {
    participant_id: number;
    registration_id: number;
    participant_name?: string;
    college_name?: string;
    contact_number?: string;
    transaction_id?: string;
    payment_status?:
      | "NO_PAYMENT"
      | "PAYMENT_DONE"
      | "VERIFIED_PAYMENT"
      | "INVALID_PAYMENT";
  }) {
    const participantUpdate =
      await this.participantsService.updateParticipantPartial({
        id: input.participant_id,
        participant_name: input.participant_name,
        college_name: input.college_name,
        contact_number: input.contact_number,
      });

    if (participantUpdate.status === "error") {
      return participantUpdate;
    }

    if (
      input.transaction_id !== undefined ||
      input.payment_status !== undefined
    ) {
      const paymentUpdate =
        await this.participantsPaymentService.updatePaymentAdmin({
          registration_id: input.registration_id,
          transaction_id: input.transaction_id,
          status: input.payment_status,
        });

      if (paymentUpdate.status === "error") {
        return paymentUpdate;
      }
    }

    return {
      status: "success",
      participant: participantUpdate.participant,
    };
  }

  async fetchRegisteredPaymentData(registration_id: number) {
    const result =
      await this.participantsPaymentService.createOrFindPaymentEntry(
        registration_id,
        true,
      );

    return result.participantsPayment;
  }
}
