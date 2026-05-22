import pg from "pg";
import { Pool } from "pg";
import dotenv from "dotenv"

dotenv.config()

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "notes_api",
    password: process.env.DB_PASS,
    port: 5432
});

export default pool;