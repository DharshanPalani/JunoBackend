import pool from "./db";

const schemaExecutor = async (log: boolean = false) => {
  await pool.query(`CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
    )`);

  if (log) {
    console.log("Query executed successfully");
  }
};

export default schemaExecutor;
