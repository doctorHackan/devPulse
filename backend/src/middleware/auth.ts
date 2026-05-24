import type { NextFunction, Request, Response } from "express";
import type { ROLE } from "../types";
import  jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";


const auth = (...roles : ROLE[])=>{
    return async(req : Request, res : Response, next : NextFunction) => {
        try{
            const token = req.headers.authorization;

            if (!token) {
                res.status(401).json({
                success: false,
                message: "Unauthorized access!!",
                });
            }

            const payload  = jwt.verify(token as string, config.secret) as JwtPayload;
        }
        catch(err : any){

        }
    }
}