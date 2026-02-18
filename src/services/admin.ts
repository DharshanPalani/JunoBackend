import { AdminRepository } from "../repository/admin.js";

type AdminRegistrationReturn = {
  message: string;
  status: "success" | "error";
  data: any | null;
};

export class AdminService {
  private adminRepository = new AdminRepository();

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
      await Promise.all(ids.map((id) => this.adminRepository.markDelete(id)));

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
}
