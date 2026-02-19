import "dotenv/config";

// Accept Aiven's self-signed SSL certificate (required for PostgreSQL connection)
if (process.env.DATABASE_URL?.includes("aivencloud")) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import { initDb, createUser, findUserByEmail, findUserByUserId } from "./db.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Initialize database and start server
initDb().catch((err) => {
  console.error("Database init failed:", err.message);
});

// Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { userId, email, phone, password } = req.body;

    if (!userId?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({
        error: "User ID, Email and Password are required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters",
      });
    }

    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const existingUserId = await findUserByUserId(userId.trim());
    if (existingUserId) {
      return res.status(409).json({ error: "User ID already taken" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await createUser({
      userId: userId.trim(),
      email: email.trim().toLowerCase(),
      phone: (phone || "").trim() || null,
      passwordHash,
    });

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user.id,
        user_id: user.user_id,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    let msg = "Registration failed";
    if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND") {
      msg = "Database connection failed. Check DATABASE_URL in server/.env";
    } else if (err.message) {
      msg = err.message;
    }
    res.status(500).json({ error: msg });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({
        error: "Email and Password are required",
      });
    }

    const user = await findUserByEmail(email.trim());
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        user_id: user.user_id,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    let msg = "Login failed";
    if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND") {
      msg = "Database connection failed. Check DATABASE_URL in server/.env";
    } else if (err.message) {
      msg = err.message;
    }
    res.status(500).json({ error: msg });
  }
});

// Health check
app.get("/api/health", (_, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
