import express from "express"
import notesRouter from "./routes/notes.js"

const app = express();
const port = 3000;

app.use(express.json())

app.use("/notes",notesRouter);

app.get("/",(req,res) => {
    res.send("Hello World!!")
})

app.listen(port,() => {
    console.log(`server running on ${port}`)
})