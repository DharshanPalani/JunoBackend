import type { Registration } from "../model/registration.js";
import pool from "../db.js";

export class RegistrationRepository {
  async create(participant_id: number, day_id: number): Promise<Registration> {
    const result = await pool.query(
      `INSERT INTO registrations (participant_id, day_id) VALUES ($1, $2) RETURNING *`,
      [participant_id, day_id]
    );

    return result.rows[0];
  }
}
