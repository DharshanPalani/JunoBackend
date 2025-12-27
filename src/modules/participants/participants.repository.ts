import pool from "../../db.ts";
import { Participant } from "./participants.model.ts";

export class ParticipantsRepository {
  async create(data: Omit<Participant, "id" | "created_at">) {
    const result = await pool.query(
      `INSERT INTO participants
      (
        participant_name,
        college_name,
        department,
        academic_year,
        contact_number,
        email
      )

      VALUES ($1, $2, $3, $4, $5, $6)

      RETURNING *`,
      [
        data.participant_name,
        data.college_name,
        data.department,
        data.academic_year,
        data.contact_number,
        data.email,
      ],
    );
    return result.rows[0];
  }

  async findByContactNumberOrEmail(
    contact_numer: string,
    email: string,
  ): Promise<Participant> {
    const result = await pool.query(
      `SELECT * FROM participants WHERE contact_number = $1 OR email = $2`,
      [contact_numer, email],
    );
    return result.rows[0];
  }
}
