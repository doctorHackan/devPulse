import type { NextFunction, Request, Response } from "express";
import sendResponse from "../utility/sendResponse";
import { pool } from "../db";


const issueUpdateMiddleware = async (req : Request, res : Response, next : NextFunction)=>{
    try{
        const {id} = req.params;
        const user = req.user;
        // console.log("here");

        
        if(!user) 
            throw new Error("Invalid User");
        if(!id)
            throw new Error("Need id");

        const {id:user_id, role} = user;
        const result = await pool.query(`
            SELECT * FROM issues
            WHERE id = $1
            `,[id]);

        if(result.rows.length === 0)
            throw new Error("NOT_FOUND");

        const issue = result.rows[0];


        if(role === "contributor" && user_id !== issue.reporter_id)
            throw new Error("FORBIDDEN_OWNERSHIP");
        if(role === "contributor" && user_id === issue.reporter_id && issue.status !== "open")
            throw new Error("FORBIDDEN_STATUS");

        // console.log("here");
        next();
    }
    catch(err : any){

        if (err.message === "NOT_FOUND") {
            return sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Issue not found",
            });
        }

        if (err.message.startsWith("FORBIDDEN")) {
            let message = "You do not have permission to update this issue";
            if (err.message === "FORBIDDEN_STATUS") message = "You can only update issues that are open";
            if (err.message === "FORBIDDEN_OWNERSHIP") message = "You can only update your own issues";

            return sendResponse(res, {
                statusCode: 403, 
                success: false,
                message: message,
            });
        }
        
        return sendResponse(res, {
            statusCode: 500,
            success: false,
            message: "Failed to update issue",
            error: err.message
        });
    }
}

export default issueUpdateMiddleware;