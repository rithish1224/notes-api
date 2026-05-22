import { Router } from "express";
import pool from "../db.js";

const router = Router();

router.get("/:user_id",async (req, res) => {
    const user_id = req.params.user_id
    const note = await pool.query("SELECT * FROM notes where user_id = $1;",[user_id])
    res.json(note.rows)
});

router.post("/",async (req,res) => {
    
    const user_id = req.body.user_id;
    const title = req.body.title;
    const content = req.body.content;


    const result = await pool.query("INSERT INTO notes(title,content,user_id) VALUES ($1,$2,$3) RETURNING *",  [title, content, user_id]) 

    res.status(201).json({
    message: "Note created successfully",
    note: result.rows
});
})

router.get("/search",async (req,res) => {
    const title = req.query.title

    const result = await pool.query("SELECT * FROM notes WHERE title LIKE $1",[`%${title}%`])
    if(result.rows.length === 0){
        return res.status(404).json(
            {
                message : "note not found"
            }
        )
    }

    res.json(result.rows)
})

router.get("/:id",async (req,res) => {
    const id = Number(req.params.id);
    
    const result = await pool.query("SELECT * FROM notes WHERE id = $1",[id]);

    if(result.rows.length === 0){
        return res.status(404).json({
        message: "Note not found",
    });
    }

    res.json(result.rows[0])
})

router.put("/:id",async (req,res) => {
    const id = Number(req.params.id);
    const title = req.body.title;
    const content = req.body.content;
    
    const result = await pool.query("UPDATE notes SET title=$1,content=$2 WHERE id=$3 RETURNING * ",[title,content,id]);

    if (result.rows.length === 0) {
        return res.status(404).json({
            message: "Note not found"
        });
    }

    res.json({
    message: "Note updated successfully",
    note : result.rows[0]
});

})

router.delete("/:id",async (req,res) => {
    const id = Number(req.params.id);
    
    const result = await pool.query("DELETE FROM notes WHERE id = $1 RETURNING *",[id])

    console.log(result.rows);

    if(result.rows.length === 0){
        res.status(404).json({
            message : "Note not found",
        })
    }
    res.json("note deleted successfully")
})



export default router;