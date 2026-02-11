import { ParticipantsRepository } from "../repository/participants.js";
import type { Participant } from "../model/participants.js";

type ParticipantServiceReturn = {
  participant: Participant | null;
  status: string;
  error?: string;
};

export class ParticipantsService {
  private participantsRepo = new ParticipantsRepository();

  async findParticipantWithID(input: Pick<Participant, "id">) {
    const result = await this.participantsRepo.find(input);
    return result
      ? { participant: result, status: "found" }
      : { participant: null, status: "not_found" };
  }

  async findOrCreateParticipant(
    input: Pick<Participant, "google_id" | "participant_name" | "email">,
  ): Promise<ParticipantServiceReturn> {
    let result = await this.participantsRepo.find(input);

    if (result) {
      return { participant: result, status: "found" };
    }

    result = await this.participantsRepo.create(input);

    return { participant: result, status: "created" };
  }

  async updateParticipantPartial(
    input: Partial<Omit<Participant, "google_id" | "email" | "created_at">> & {
      id: number;
    },
  ) {
    try {
      const result = await this.participantsRepo.updatePartial(input);

      if (!result) {
        throw new Error("Participant update failed");
      }

      return {
        participant: result,
        status: "success",
      };
    } catch (error: any) {
      return {
        participant: null,
        status: "error",
        error: error.message,
      };
    }
  }
}
