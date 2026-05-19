import { Router } from "express";
import notes from "../data/dummy.js"

const router = Router();

router.get("/", (req, res) => {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    
    const sIndex = (page-1)*limit;
    const eIndex = sIndex + limit;

    const note = notes.slice(sIndex,eIndex);

    res.json(note)
});

router.post("/",(req,res) => {
    
    const id = notes.length+1;
    const title = req.body.title;
    const content = req.body.content;
    const tags = req.body.tags;
    const date = new Date().toLocaleDateString('en-US');

    const newNote = {id,title,content,tags,createdAt:date}

    notes.push(newNote);

    res.status(201).json({
        message: "Note created successfully",
        note: newNote
    });
})

router.get("/search",(req,res) => {
    const title = req.query.title

    const matchedNotes = notes.filter((note) => 
        note.title.toLowerCase().includes(title.toLowerCase())
    )

    if(matchedNotes.length === 0){
        return res.status(404).json(
            {
                message : "note not found"
            }
        )
    }

    res.json(matchedNotes)
})

router.get("/:id",(req,res) => {
    const id = Number(req.params.id);
    const note = notes.find((note) => 
        note.id === id
    )

    console.log(req.params.id);
    console.log(id);
    console.log(notes);

    if(!note){
        return res.status(404).json({
        message: "Note not found",
    });
    }

    

    res.json(note)
})

router.put("/:id",(req,res) => {
    const id = Number(req.params.id);
    const note = notes.find((note) => 
        note.id === id
    )

    if (!note) {
        return res.status(404).json({
            message: "Note not found"
        });
    }

    const date = new Date().toLocaleDateString('en-US');

    note.title = req.body.title;
    note.content = req.body.content;
    note.tags = req.body.tags;
    note.createdAt = date;

    res.json({
    message: "Note updated successfully",
    note
});

})

router.delete("/:id",(req,res) => {
    const id = Number(req.params.id);
    const index = notes.findIndex((note) => 
        note.id === id
    )
    
    if(index === -1){
         return res.status(404).json({
            message: "Note not found"
        });
    }
    
    notes.splice(index,1)

    res.json("note deleted successfully")
})



export default router;