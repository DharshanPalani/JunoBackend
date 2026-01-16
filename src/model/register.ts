export interface CreateParticipantDTO {
  participant_id: number;
}

export interface CreateRegistrationDTO {
  day_id: number;
}

export interface CreateEventParticipationDTO {
  event_id: number[];
}

export interface CreateEventDTO {
  participant: CreateParticipantDTO;
  registration: CreateRegistrationDTO;
  participationEvent: CreateEventParticipationDTO;
}
