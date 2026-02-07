import pool from "../db.js";

export class AdminRepository {
  async getAllRegistration() {
    const query = `SELECT
            p.id                     AS participant_id,
            p.participant_name,
            p.college_name,
            p.department,
            p.academic_year,
            p.contact_number,
            p.email,

            d.id                     AS day_id,
            d.day_name,

            r.id                     AS registration_id,
            r.registered_at,

            pp.status                AS payment_status,
            pp.payment_screenshot,
            pp.paid_at,

            COALESCE(
              json_agg(
                DISTINCT jsonb_build_object(
                  'event_id', e.id,
                  'event_name', e.event_name
                )
              ) FILTER (WHERE e.id IS NOT NULL),
              '[]'
            ) AS events

          FROM registrations r
          JOIN participants p
            ON p.id = r.participant_id
          JOIN event_days d
            ON d.id = r.day_id
          LEFT JOIN registration_events re
            ON re.registration_id = r.id
          LEFT JOIN events e
            ON e.id = re.event_id
          LEFT JOIN participants_payment pp
            ON pp.registration_id = r.id

          GROUP BY
            p.id,
            d.id,
            r.id,
            pp.id

          ORDER BY
            d.id,
            r.registered_at DESC;
      `;

    const result = await pool.query(query);

    return result.rows;
  }
}
