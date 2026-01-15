import pool from "@/db";
import type { Participant } from "./participants.model";

export class ParticipantsRepository {
  async create(
    data: Pick<Participant, "google_id" | "participant_name" | "email">,
  ) {
    const result = await pool.query(
      `INSERT INTO participants
      (
        google_id,
        participant_name,
        email
      )

      VALUES ($1, $2, $3)

      RETURNING *`,
      [data.google_id, data.participant_name, data.email],
    );
    return result.rows[0];
  }

  async find(
    input: Pick<Participant, "google_id"> | Pick<Participant, "id">,
  ): Promise<Participant | null> {
    if ("google_id" in input) {
      const result = await pool.query(
        `SELECT * FROM participants WHERE google_id = $1`,
        [input.google_id],
      );
      return result.rows[0] ?? null;
    }

    const result = await pool.query(
      `SELECT * FROM participants WHERE id = $1`,
      [input.id],
    );
    return result.rows[0] ?? null;
  }
}
