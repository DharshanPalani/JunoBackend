import type { Day } from "./day.model.ts";
import pool from "../db.ts";

export class DayRepository {
  async create(day_name: string): Promise<Day> {
    const result = await pool.query(
      `INSERT INTO event_days(day_name) VALUES($1) RETURNING *`,
      [day_name],
    );

    return result.rows[0];
  }

  async find(day_id: number): Promise<Day> {
    const result = await pool.query(`SELECT * FROM event_days WHERE id = $1`, [
      day_id,
    ]);

    return result.rows[0];
  }
}
