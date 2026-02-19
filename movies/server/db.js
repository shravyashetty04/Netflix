import pg from "pg";

const { Pool } = pg;

const connUrl = process.env.DATABASE_URL;

// Aiven uses self-signed certs - must accept them for SSL to work
const isAiven = connUrl?.includes("aivencloud");
const pool = new Pool({
  connectionString: connUrl,
  ssl: isAiven ? { rejectUnauthorized: false } : false,
});

export async function initDb() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Database initialized");
  } finally {
    client.release();
  }
}

export async function createUser({ userId, email, phone, passwordHash }) {
  const result = await pool.query(
    `INSERT INTO users (user_id, email, phone, password_hash)
     VALUES ($1, $2, $3, $4)
     RETURNING id, user_id, email, phone, created_at`,
    [userId, email, phone, passwordHash]
  );
  return result.rows[0];
}

export async function findUserByEmail(email) {
  const result = await pool.query(
    "SELECT * FROM users WHERE LOWER(email) = LOWER($1)",
    [email]
  );
  return result.rows[0];
}

export async function findUserByUserId(userId) {
  const result = await pool.query(
    "SELECT * FROM users WHERE user_id = $1",
    [userId]
  );
  return result.rows[0];
}

export default pool;
