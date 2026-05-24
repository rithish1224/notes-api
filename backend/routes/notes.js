import { Router } from "express";
import pool from "../db.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/",authMiddleware,async (req, res) => {
    const user_id = req.user.id
    const note = await pool.query("SELECT * FROM notes where user_id = $1;",[user_id])
    res.json(note.rows)
    console.log(req.user)
});

router.post("/",authMiddleware,async (req,res) => {
    
    const user_id = req.user.id;
    const title = req.body.title;
    const content = req.body.content;


    const result = await pool.query("INSERT INTO notes(title,content,user_id) VALUES ($1,$2,$3) RETURNING *",  [title, content, user_id]) 

    res.status(201).json({
    message: "Note created successfully",
    note: result.rows
});
})

router.get("/search",authMiddleware,async (req,res) => {
    const title = req.query.title;
    const user_id = req.user.id;

    const result = await pool.query("SELECT * FROM notes WHERE title LIKE $1 AND user_id=$2",[`%${title}%`,user_id])
    if(result.rows.length === 0){
        return res.status(404).json(
            {
                message : "note not found"
            }
        )
    }

    res.json(result.rows)
})

router.get("/:id",authMiddleware,async (req,res) => {
    const id = Number(req.params.id);
    const user_id = req.user.id
    
    const result = await pool.query("SELECT * FROM notes WHERE id = $1 AND user_id=$2",[id,user_id]);

    if(result.rows.length === 0){
        return res.status(404).json({
        message: "Note not found",
    });
    }

    res.json(result.rows[0])
})

router.put("/:id",authMiddleware,async (req,res) => {
    const id = Number(req.params.id);;
    const user_id = req.user.id;
    const title = req.body.title;
    const content = req.body.content;
    
    const result = await pool.query("UPDATE notes SET title=$1,content=$2 WHERE id=$3 AND user_id=$4 RETURNING * ",[title,content,id,user_id]);

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

router.delete("/:id",authMiddleware,async (req,res) => {
    const id = Number(req.params.id);
    const user_id = req.user.id;
    
    const result = await pool.query("DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING *",[id,user_id])

    console.log(result.rows);

    if(result.rows.length === 0){
        res.status(404).json({
            message : "Note not found",
        })
    }
    res.json("note deleted successfully")
})



export default router;