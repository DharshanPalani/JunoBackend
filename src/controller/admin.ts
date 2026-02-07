import { Request, Response } from "express";
import { AdminService } from "../services/admin.js";

export class AdminController {
  private adminService = new AdminService();

  async fetchRegistrations(request: Request, response: Response) {
    try {
      const result = await this.adminService.fetchRegistrations();
      response
        .status(result.status == "success" ? 201 : 409)
        .json({ message: result.message, data: result.data });
    } catch (error) {
      response
        .status(500)
        .json({ message: "Internal server error from admin" });
    }
  }
}
