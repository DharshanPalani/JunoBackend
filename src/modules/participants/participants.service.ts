import { ParticipantsRepository } from "./participants.repository.ts";
import { Participant } from "./participants.model.ts";

type ParticipantServiceReturn = {
  participant: Participant | null;
  status: string;
};

export class ParticipantsService {
  private participantsRepo: ParticipantsRepository;

  constructor() {
    this.participantsRepo = new ParticipantsRepository();
  }

  async findOrCreateParticipant(
    input: Omit<Participant, "id" | "created_at">,
  ): Promise<ParticipantServiceReturn | null> {
    let result = await this.participantsRepo.findByContactNumberOrEmail(
      input.contact_number,
      input.email,
    );

    if (result) {
      return { participant: result, status: "found" };
    }

    return { participant: result, status: "created" };
  }
}
