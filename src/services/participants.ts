import { ParticipantsRepository } from "../repository/participants.js";
import type { Participant } from "../model/participants.js";

type ParticipantServiceReturn = {
  participant: Participant | null;
  status: string;
};

export class ParticipantsService {
  private participantsRepo: ParticipantsRepository;

  constructor() {
    this.participantsRepo = new ParticipantsRepository();
  }

  async findParticipantWithID(
    input: Pick<Participant, "id">
  ): Promise<ParticipantServiceReturn> {
    const result = await this.participantsRepo.find(input);

    if (result) {
      return { participant: result, status: "found" };
    }

    return { participant: null, status: "not_found" };
  }

  async findOrCreateParticipant(
    input: Pick<Participant, "google_id" | "participant_name" | "email">
  ): Promise<ParticipantServiceReturn> {
    let result = await this.participantsRepo.find(input);

    if (result) {
      return { participant: result, status: "found" };
    }

    result = await this.participantsRepo.create(input);

    return { participant: result, status: "created" };
  }
}
