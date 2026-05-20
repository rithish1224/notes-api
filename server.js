import express from "express"
import notesRouter from "./routes/notes.js"
import authRouter from "./routes/auth.js"
import pool from "./db.js";

const app = express();
const port = 3000;

app.use(express.json())

pool.query("SELECT NOW()", (err, result) => {

    if (err) {
        console.log(err);
    } else {
        console.log(result.rows);
    }

});

app.use("/notes",notesRouter);
app.use("/auth",authRouter);

app.get("/",(req,res) => {
    res.send("Hello World!!")
})

app.listen(port,() => {
    console.log(`server running on ${port}`)
})