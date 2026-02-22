import type { Day } from "../model/day.js";
import pool from "../db.js";

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

  async findByName(day_name): Promise<Day> {
    const result = await pool.query(
      `SELECT * FROM event_days WHERE day_name = $1`,
      day_name,
    );

    return result.rows[0];
  }
}
