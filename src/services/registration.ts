import { RegistrationRepository } from "../repository/registration.js";
import type { Registration } from "../model/registration.js";

type RegistrationStatus = "registered" | "already_registered";

type RegistrationServiceReturn = {
  registeredData: Registration | null;
  status: RegistrationStatus;
};

export class RegistrationService {
  private registrationRepo = new RegistrationRepository();

  async createOrFindRegistry(
    participant_id: number,
    day_id: number,
  ): Promise<RegistrationServiceReturn> {
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

        if (!existing) {
          throw new Error("Registration exists but could not be found");
        }

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
    return this.registrationRepo.find(participant_id, day_id);
  }
}
