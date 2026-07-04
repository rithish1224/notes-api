import dotenv from "dotenv"
import { createClient } from "redis";

dotenv.config()

const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on("error", (err) => {
  console.error("Redis Error:", err);
});

export default redis;
