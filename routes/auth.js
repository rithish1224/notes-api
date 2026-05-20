import { Router } from "express";
import pool from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();
const saltRounds = 10;
const secret = "mysecretkey"

router.post("/register", async (req, res) => {

    try {

        const username = req.body.username;
        const password = req.body.password;

        const checkuser = await pool.query(
            "SELECT * FROM users WHERE name = $1",
            [username]
        );

        if (checkuser.rows.length !== 0) {
            return res.status(409).json({
                message: "user already exist"
            });
        }

        const hash = await bcrypt.hash(password, saltRounds);

        const result = await pool.query(
            "INSERT INTO users(name,password) VALUES ($1,$2) RETURNING *",
            [username, hash]
        );

        res.status(201).json({
            message: "user registered successfully",
            user: result.rows[0]
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "server error"
        });

    }

});

router.post("/login", async (req,res) => {
    try{
        const username = req.body.username;
        const password = req.body.password;

        const checkuser = await pool.query(
            "SELECT * FROM users WHERE name = $1",
            [username]
        );

        if(checkuser.rows.length === 0){
            return res.status(409).json({
                message: "user doesnt exist"
            });
        }
        
        const hash = await pool.query("SELECT password from users where name=$1",[username]);

        const result = await bcrypt.compare(password,hash.rows[0].password)

         const obj = {
                id:checkuser.rows[0].id,
                name:checkuser.rows[0].name
            };

        if(result){
            const token = jwt.sign(obj, secret);
            
            return res.status(200).json({
                message:"Logged in successfully",
                token : token
            })
        }
        else{
            return res.status(404).json({
                message:"wrong password"
            })
        }
    }catch(err){
        console.log(err)

        res.status(500).json({
            message: "server error"
        });

    }
});

export default router;