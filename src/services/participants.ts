import { ParticipantsRepository } from "../repository/participants.js";
import type { Participant } from "../model/participants.js";

type ParticipantServiceReturn = {
  participant: Participant | null;
  status: string;
  error?: string;
};

export class ParticipantsService {
  private participantsRepo: ParticipantsRepository;

  constructor() {
    this.participantsRepo = new ParticipantsRepository();
  }

  async findParticipantWithID(
    input: Pick<Participant, "id">,
  ): Promise<ParticipantServiceReturn> {
    const result = await this.participantsRepo.find(input);

    if (result) {
      return { participant: result, status: "found" };
    }

    return { participant: null, status: "not_found" };
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

  async updateParticipant(
    input: Omit<Participant, "google_id" | "email" | "created_at">,
  ): Promise<ParticipantServiceReturn> {
    try {
      const result = await this.participantsRepo.update(input);
      if (!result) {
        throw new Error("Update didn't return the participant");
      }
      return {
        participant: result,
        status: "success",
      };
    } catch (error) {
      return {
        participant: null,
        status: "error",
        error: error.message,
      };
    }
  }
}
