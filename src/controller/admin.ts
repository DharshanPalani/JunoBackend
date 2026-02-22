import { Request, Response } from "express";
import { AdminService } from "../services/admin.js";
import { AuthRequest } from "../middlewares/auth.js";

export class AdminController {
  private adminService = new AdminService();

  async fetchRegistrations(_request: Request, response: Response) {
    try {
      const result = await this.adminService.fetchRegistrations();
      response
        .status(result.status === "success" ? 200 : 409)
        .json({ message: result.message, data: result.data });
    } catch (error) {
      response
        .status(500)
        .json({ message: "Internal server error from admin" });
    }
  }

  async deleteRegistration(request: Request, response: Response) {
    const { delete_ids } = request.body;

    if (!delete_ids || !Array.isArray(delete_ids)) {
      return response.status(400).json({ message: "Invalid request" });
    }

    try {
      const result = await this.adminService.softDelete(delete_ids);

      response
        .status(result.status === "success" ? 200 : 409)
        .json({ message: result.message });
    } catch (error) {
      response
        .status(500)
        .json({ message: "Internal server error from admin" });
    }
  }

  async recoverDeletedRegistrations(request: Request, response: Response) {
    const { recover_ids } = request.body;

    if (!recover_ids || !Array.isArray(recover_ids)) {
      return response.status(400).json({ message: "Invalid request" });
    }

    try {
      const result = await this.adminService.recoverDelete(recover_ids);

      response
        .status(result.status == "success" ? 202 : 409)
        .json({ message: result.message });
    } catch (error) {
      response
        .status(500)
        .json({ message: "Internal server error from admin" });
    }
  }

  async fetchDeletedRegistration(_request: Request, response: Response) {
    try {
      const result = await this.adminService.fetchDeletedRegistrations();
      response
        .status(result.status === "success" ? 200 : 409)
        .json({ message: result.message, data: result.data });
    } catch (error) {
      response
        .status(500)
        .json({ message: "Internal server error from admin" });
    }
  }

  async updateRegistration(request: AuthRequest, response: Response) {
    try {
      const {
        participant_id,
        registration_id,
        participant_name,
        college_name,
        contact_number,
        transaction_id,
        payment_status,
      } = request.body;

      const user = request.user;

      if (!participant_id || !registration_id) {
        return response.status(400).json({
          status: "error",
          message: "participant_id and registration_id are required",
        });
      }

      const result = await this.adminService.updateStandbyParticipant({
        participant_id,
        registration_id,
        participant_name,
        college_name,
        contact_number,
        transaction_id,
        payment_status,
      });

      if (result.status === "error") {
        return response.status(400).json(result);
      }

      return response.status(200).json({
        status: "success",
        message: "Registration updated successfully",
      });
    } catch (error: any) {
      console.error("Update registration error:", error);

      return response.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  async fetchRegistrationPayment(request: Request, response: Response) {
    const { registration_id } = request.query as {
      registration_id?: string;
    };

    if (!registration_id) {
      return response.status(400).json({ message: "participant_id missing" });
    }

    const result = await this.adminService.fetchRegisteredPaymentData(
      parseInt(registration_id),
    );

    return response.status(200).json({ message: "Success", data: result });
  }
}
