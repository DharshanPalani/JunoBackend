import pool from "../db.js";
import type { Participant } from "../model/participants.js";

export class ParticipantsRepository {
  async create(
    data: Pick<Participant, "google_id" | "participant_name" | "email">,
  ) {
    const result = await pool.query(
      `INSERT INTO participants (google_id, participant_name, email)
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

  async updatePartial(
    input: Partial<Omit<Participant, "google_id" | "email" | "created_at">> & {
      id: number;
    },
  ): Promise<Participant | null> {
    const { id, ...fields } = input;

    const entries = Object.entries(fields).filter(
      ([_, value]) => value !== undefined,
    );

    if (entries.length === 0) {
      const existing = await this.find({ id });
      return existing;
    }

    const setClauses = entries.map(([key], index) => `${key} = $${index + 1}`);

    const values = entries.map(([_, value]) => value);

    const query = `
      UPDATE participants
      SET ${setClauses.join(", ")}
      WHERE id = $${entries.length + 1}
      RETURNING *
    `;

    const result = await pool.query(query, [...values, id]);

    return result.rows[0] ?? null;
  }
}
