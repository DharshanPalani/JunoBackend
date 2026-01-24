import pool from "../db.js";
import { EventParticipation } from "../model/eventParticipation.js";

export class EventParticipationRepository {
  async create(
    data: Omit<EventParticipation, "id">,
  ): Promise<EventParticipation> {
    const result = await pool.query(
      `INSERT INTO registration_events (registration_id, event_id) VALUES($1, $2) RETURNING *`,
      [data.registration_id, data.event_id],
    );

    // console.log(result);

    return result.rows[0];
  }

  async findAll(
    data: Pick<EventParticipation, "registration_id">,
  ): Promise<EventParticipation[]> {
    const result = await pool.query(
      `SELECT * FROM registration_events WHERE registration_id = $1`,
      [data.registration_id],
    );

    return result.rows;
  }
}
