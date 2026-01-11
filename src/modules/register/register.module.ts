export interface CreateParticipantDTO {
  participant_name: string;
  college_name: string;
  department: string;
  academic_year: string;
  contact_number: string;
  email: string;
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
