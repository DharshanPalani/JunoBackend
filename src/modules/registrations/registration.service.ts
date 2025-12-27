import { RegistrationRepository } from "./registration.repository.ts";
import { Registration } from "./registration.model.ts";

type RegistrationServiveReturn = {
  registeredData: Registration | null;
  status: string;
};

export class RegistrationService {
  private registrationRepo: RegistrationRepository;

  constructor() {
    this.registrationRepo = new RegistrationRepository();
  }

  async createRegistry(
    input: Omit<Registration, "id" | "registered_at">,
  ): Promise<RegistrationServiveReturn> {
    try {
      const result = await this.registrationRepo.create(input);

      return {
        registeredData: result,
        status: "registered",
      };
    } catch (error: any) {
      if (error.code === "23505") {
        return {
          registeredData: null,
          status: "already_registered",
        };
      }
      throw error;
    }
  }
}
