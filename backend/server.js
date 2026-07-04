import express from "express"
import notesRouter from "./routes/notes.js"
import authRouter from "./routes/auth.js"
import pool from "./db.js";
import cors from "cors"
import redis from "./config/redis.js";
import testRouter from "./routes/test.js"

const app = express();
const port = 3000;

app.use(express.json())

try{
    await redis.connect();
    console.log("Connected to redis")
}catch(err){
    console.log(err)
}

try{
    await pool.query("SELECT NOW()", (err, result) => {

    if (err) {
        console.log(err);
    } else {
        console.log(result.rows);
    }

    console.log("Postgres Connected")
});
}catch(err){
    console.error(err)
}

app.use("/notes",notesRouter);
app.use("/auth",authRouter);
app.use("/test",testRouter)

app.get("/",(req,res) => {
    res.send("Hello World!!")
})

app.listen(port,() => {
    console.log(`server running on ${port}`)
})