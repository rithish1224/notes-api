import { Router } from "express";
import redis from "../config/redis.js";

const router = Router()

router.get("/redis", async (req, res) => {
    try {
        console.log("Before SET");

        await redis.set("hello", "world");

        console.log("After SET");

        const value = await redis.get("hello");

        console.log(value);

        res.json({ value });
    } catch (err) {
        console.error(err);
        res.status(500).json(err.message);
    }
});

export default router