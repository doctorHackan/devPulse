import type { NextFunction, Request, Response } from "express";
import type { ROLE } from "../types";
import  jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool} from "../db";
import sendResponse from "../utility/sendResponse";


const auth = (...roles : ROLE[])=>{
    return async(req : Request, res : Response, next : NextFunction) => {
        try{
            // console.log("here");
            const token = req.headers.authorization;

            if (!token) {
                res.status(401).json({
                success: false,
                message: "Unauthorized access!!",
                });
            }

            const payload  = jwt.verify(token as string, config.secret) as JwtPayload;
            
            const user = {...payload};
            const {id, role, name} = user;
            const result = await pool.query(`
                SELECT * FROM users
                WHERE id = $1
            `,[id])
            if(result.rows[0].length === 0){
                throw new Error("User Not Found");
            }

            if (roles.length && !roles.includes(user.role)) {
                throw new Error("Cannot Access");
            }

            req.user = user;

            next();
        }
        catch(err : any){
            sendResponse(res, {
                statusCode: 401,
                success: false,
                message: err.message,
                error: err,
            });
        }
    }
}

export default auth;