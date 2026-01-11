import { EventParticipation } from "./eventParticipation.model";
import pool from "../../db";

export class EventParticipationRepository {
  async create(
    data: Omit<EventParticipation, "id">,
  ): Promise<EventParticipation> {
    const result = await pool.query(
      `INSERT INTO registration_events (registration_id, event_id) VALUES($1, $2) RETURNING *`,
      [data.registration_id, data.event_id],
    );

    console.log(result);

    return result.rows[0];
  }
}
