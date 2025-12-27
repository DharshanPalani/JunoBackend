import { Registration } from "./registration.model.ts";
import pool from "../../db.ts";
import { Participant } from "../participants/participants.model.ts";

export class RegistrationRepository {
  async create(participant_id: number, day_id: number): Promise<Registration> {
    const result = await pool.query(
      `INSERT INTO registrations (participant_id, day_id) VALUES ($1, $2) RETURNING *`,
      [participant_id, day_id],
    );

    return result.rows[0];
  }
}
