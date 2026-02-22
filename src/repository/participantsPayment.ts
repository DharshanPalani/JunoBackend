import pool from "../db.js";
import type { ParticipantsPayments } from "../model/participantsPayment.js";

export class ParticipantsPaymentRepository {
  async create(
    input: Pick<ParticipantsPayments, "registration_id">,
  ): Promise<ParticipantsPayments> {
    const result = await pool.query(
      `INSERT INTO participants_payment(registration_id, status) VALUES($1, $2) RETURNING *`,
      [input.registration_id, "NO_PAYMENT"],
    );

    return result.rows[0];
  }

  async find(
    input:
      | Pick<ParticipantsPayments, "id">
      | Pick<ParticipantsPayments, "registration_id">,
  ): Promise<ParticipantsPayments | null> {
    if ("id" in input) {
      const result = await pool.query(
        `SELECT * FROM participants_payment WHERE id = $1`,
        [input.id],
      );

      return result.rows[0] ?? null;
    }

    const result = await pool.query(
      `SELECT * FROM participants_payment WHERE registration_id = $1`,
      [input.registration_id],
    );

    return result.rows[0] ?? null;
  }

  async update(input: {
    id: number;
    status?: ParticipantsPayments["status"];
    transaction_id?: string;
    payment_screenshot?: string;
  }): Promise<ParticipantsPayments> {
    const result = await pool.query(
      `
    UPDATE participants_payment
    SET 
      status = COALESCE($1, status),
      transaction_id = COALESCE($2, transaction_id),
      payment_screenshot = COALESCE($3, payment_screenshot),
      paid_at = CASE
        WHEN COALESCE($1, status) IN ('PAYMENT_DONE', 'VERIFIED_PAYMENT')
        THEN NOW()
        ELSE paid_at
      END
    WHERE id = $4
    RETURNING *
    `,
      [
        input.status ?? null,
        input.transaction_id ?? null,
        input.payment_screenshot ?? null,
        input.id,
      ],
    );

    return result.rows[0];
  }
}
