import pool from "./db.js";

const schemaExecutor = async (log: boolean = false) => {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
    )`);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS participants(
        id SERIAL PRIMARY KEY,
        google_id TEXT UNIQUE,
        participant_name TEXT,
        college_name TEXT,
        department TEXT,
        academic_year TEXT,
        contact_number TEXT,
        email TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
    )`);

  await pool.query(`
          CREATE TABLE IF NOT EXISTS event_days(
          id SERIAL PRIMARY KEY,
          day_name TEXT UNIQUE NOT NULL
      )`);

  await pool.query(`CREATE TABLE IF NOT EXISTS events(
      id SERIAL PRIMARY KEY,
      event_name TEXT NOT NULL,
      event_day_id INT REFERENCES event_days(id) ON DELETE CASCADE
      )`);

  await pool.query(`CREATE TABLE IF NOT EXISTS registrations(
      id SERIAL PRIMARY KEY,
      participant_id INT NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
      day_id INT NOT NULL REFERENCES event_days(id) ON DELETE CASCADE,
      registered_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(participant_id, day_id)
  )`);

  await pool.query(`CREATE TABLE IF NOT EXISTS registration_events(
      id SERIAL PRIMARY KEY,
      registration_id INT NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
      event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
      UNIQUE(registration_id, event_id)
  )`);

  if (log) {
    console.log("Query executed successfully");
  }
};

export default schemaExecutor;
