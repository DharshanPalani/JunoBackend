import { Profile } from "../model/profile.js";
import pool from "../db.js";
export class ProfileRepository {
  async create(
    user_id: number,
    role_id: number,
    role_label: string,
  ): Promise<Profile> {
    const result = await pool.query(
      `INSERT INTO profiles (user_id, role_id, role_label) VALUES ($1, $2, $3) RETURNING *`,
      [user_id, role_id, role_label],
    );

    return result.rows[0];
  }

  async findByUserID(user_id: number): Promise<Profile | null> {
    const result = await pool.query(
      `SELECT * FROM profiles WHERE user_id = $1`,
      [user_id],
    );
    return result.rows[0] ?? null;
  }

  async updateProfileByUserID(
    user_id: number,
    role_id: number,
    role_label: string,
  ): Promise<Profile> {
    const result = await pool.query(
      `UPDATE profiles SET role_id = $2, role_label = $3 WHERE user_id = $1 RETURNING *`,
      [user_id, role_id, role_label],
    );

    return result.rows[0];
  }
}
