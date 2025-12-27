import { Registration } from "./registration.model.ts";
import pool from "../../db.ts";

export class RegistrationRepository {
  async create(data: Registration): Promise<Registration> {
    const result = await pool.query(
      `INSERT INTO registrations (participant_id, day_id) VALUES ($1, $2) RETURNING *`,
      [data.participant_id, data.day_id],
    );

    return result.rows[0];
  }
}
