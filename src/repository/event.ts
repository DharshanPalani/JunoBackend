import type { Event } from "../model/event.js";
import pool from "../db.js";

export class EventRepository {
  async create(data: Omit<Event, "id">): Promise<Event> {
    const result = await pool.query(
      `INSERT INTO events (event_name, event_day_id) VALUES($1, $2)`,
      [data.event_name, data.event_day_id]
    );
    return result.rows[0];
  }

  async find(event_id: number): Promise<Event> {
    const result = await pool.query(`SELECT * FROM events WHERE id = $1`, [
      event_id,
    ]);

    return result.rows[0];
  }
}
