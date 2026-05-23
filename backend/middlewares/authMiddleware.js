import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const authMiddleware = async (req,res,next) => {

    const authorization = req.headers.authorization
    let token
    if(authorization){
        token = authorization.split(" ")[1]
    }
    else{
        return res.status(401).json({
            message:"unauthorized"
        })
    }

    const secret = process.env.JWT_SECRET

    if(!token){
        return res.status(401).json({
            message:"unauthorized"
        })
    }
    else{
        try{
            const result = await jwt.verify(token,secret)
            req.user = result
            next()
        }catch(err){
            return res.status(401).json({
            message:"unauthorized"
        })
            console.error(err)
        }
    }
}

export default authMiddleware;