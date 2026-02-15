import type { Auth } from "../model/auth.js";
import pool from "../db.js";

export class AuthRepository {
  async create(username: string, password: string): Promise<Auth> {
    const result = await pool.query(
      `INSERT INTO users (username, password) VALUES($1, $2) RETURNING *`,
      [username, password],
    );

    return result.rows[0];
  }

  async findByID(user_id: number): Promise<Auth> {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [
      user_id,
    ]);

    return result.rows[0];
  }

  async findByUsername(username: string): Promise<Auth> {
    const result = await pool.query(`SELECT * FROM users WHERE username = $1`, [
      username,
    ]);

    return result.rows[0];
  }
}
