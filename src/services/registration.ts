import { RegistrationRepository } from "../repository/registration.js";
import type { Registration } from "../model/registration.js";

type RegistrationServiveReturn = {
  registeredData: Registration | null;
  status: string;
};

export class RegistrationService {
  private registrationRepo: RegistrationRepository;

  constructor() {
    this.registrationRepo = new RegistrationRepository();
  }

  async createOrFindRegistry(
    participant_id: number,
    day_id: number,
  ): Promise<RegistrationServiveReturn> {
    try {
      const result = await this.registrationRepo.create(participant_id, day_id);

      return {
        registeredData: result,
        status: "registered",
      };
    } catch (error: any) {
      if (error.code === "23505") {
        const existing = await this.registrationRepo.find(
          participant_id,
          day_id,
        );

        return {
          registeredData: existing,
          status: "already_registered",
        };
      }
      throw error;
    }
  }

  async findRegistry(
    participant_id: number,
    day_id: number,
  ): Promise<Registration | null> {
    return await this.registrationRepo.find(participant_id, day_id);
  }
}
