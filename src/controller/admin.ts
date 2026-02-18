import { Request, Response } from "express";
import { AdminService } from "../services/admin.js";

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
}
