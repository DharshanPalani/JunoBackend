import { Role } from "../model/role.js";
import pool from "../db.js";

export class RoleRepository {
  async create(role_name: string): Promise<Role> {
    const result = await pool.query(
      `INSERT INTO roles (role_name) VALUES($1) RETURNING*`,
      [role_name],
    );
    return result.rows[0];
  }

  async findRoleByID(role_id: number): Promise<Role> {
    const result = await pool.query(`SELECT * FROM roles WHERE id = $1`, [
      role_id,
    ]);

    return result.rows[0];
  }

  async findRoleByName(role_name: string): Promise<Role> {
    const result = await pool.query(
      `SELECT * FROM roles WHERE role_name = $1`,
      [role_name],
    );
    return result.rows[0];
  }
}
