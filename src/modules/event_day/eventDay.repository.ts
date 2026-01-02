import pool from "../../db";
import { EventDay } from "./eventDay.model";

export class EventDayRepository {
  async create(day_name: string): Promise<EventDay> {
    const result = await pool.query(
      `INSERT INTO event_days(day_name) VALUES($1) RETURNING *`,
      [day_name],
    );

    return result.rows[0];
  }
}
