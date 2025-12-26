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

  async registerParticipant(
    input: Omit<Participant, "id" | "created_at">,
  ): Promise<ParticipantServiceReturn | null> {
    let participantExistance =
      await this.participantsRepo.findByContactNumberOrEmail(
        input.contact_number,
        input.email,
      );

    if (participantExistance) {
      return null;
    }

    return { participant: participantExistance, status: "created" };
  }
}
