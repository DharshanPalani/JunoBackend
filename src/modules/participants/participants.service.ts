import { ParticipantsRepository } from "./participants.repository";
import { Participant } from "./participants.model";

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
  ): Promise<ParticipantServiceReturn> {
    let result = await this.participantsRepo.findByContactNumberOrEmail(
      input.contact_number,
      input.email,
    );

    if (result) {
      return { participant: result, status: "found" };
    }

    result = await this.participantsRepo.create(input);

    return { participant: result, status: "created" };
  }
}
