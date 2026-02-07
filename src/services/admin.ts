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
      return { message: error, status: "error", data: null };
    }
  }
}
