import { Request, Response } from "express";
import { AdminService } from "../services/admin.js";
import { AuthRequest } from "../middlewares/auth.js";
import supabaseClient from "../utils/supabseClient.js";

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

  async fetchParticipantByContact(req: Request, res: Response) {
    const { contact } = req.query as { contact?: string };

    console.log(contact);

    if (!contact) {
      return res.status(400).json({ message: "Contact number required" });
    }

    const result = await this.adminService.findByContact(contact);

    console.log("This is the end sybau");
    console.log(result.data);

    if (!result) {
      return res.status(404).json({ message: "Participant not found" });
    }

    return res.status(200).json({
      message: "Success",
      data: result,
    });
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
        transaction_id,
        payment_status,
      } = request.body;

      if (!participant_id || !registration_id) {
        return response.status(400).json({
          status: "error",
          message: "participant_id and registration_id are required",
        });
      }

      const result: any = await this.adminService.updateStandbyParticipant({
        participant_id,
        registration_id,
        participant_name,
        college_name,
        transaction_id,
        payment_status,
      });

      if (result.status === "error") {
        if (result.error?.includes("Transaction ID already exists")) {
          return response.status(409).json({
            status: "error",
            message: "Transaction ID already exists",
          });
        }

        return response.status(400).json({
          status: "error",
          message: result.error || "Failed to update registration",
        });
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
    try {
      const { registration_id } = request.query as {
        registration_id?: string;
      };

      if (!registration_id) {
        return response.status(400).json({
          message: "registration_id is required",
        });
      }

      const parsedRegistrationId = Number(registration_id);

      if (isNaN(parsedRegistrationId)) {
        return response.status(400).json({
          message: "registration_id must be a valid number",
        });
      }

      const result =
        await this.adminService.fetchRegisteredPaymentData(
          parsedRegistrationId,
        );

      if (!result) {
        return response.status(404).json({
          message: "Payment record not found",
        });
      }

      let signedUrl: string | null = null;

      if (result.payment_screenshot) {
        const filePath = result.payment_screenshot.replace(
          "payment_screenshots/",
          "",
        );

        const { data, error } = await supabaseClient.storage
          .from("payment_screenshots")
          .createSignedUrl(filePath, 120);

        if (error) {
          console.error("Supabase signed URL error:", error);
          return response.status(500).json({
            message: "Failed to generate screenshot URL",
          });
        }

        signedUrl = data?.signedUrl ?? null;
      }

      return response.status(200).json({
        message: "Success",
        payment_detail: {
          transaction_id: result.transaction_id ?? null,
          payment_screenshot: signedUrl,
          status: result.status ?? null,
        },
      });
    } catch (error) {
      console.error("fetchRegistrationPayment error:", error);

      return response.status(500).json({
        message: "Internal server error",
      });
    }
  }
}
