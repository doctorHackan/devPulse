import type { Request, Response } from "express";
import sendResponse from "../../utility/sendResponse";
import { issueService } from "./issue.service";


const createIssue = async (req : Request, res : Response) =>{
    try{
        const result = await issueService.createIssue(req.body);
        sendResponse(res,{
            statusCode: 201,
            success: true,
            message: "Issue created successfully",
            data:result,
        })

    }
    catch(err : any){
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: err.message,
            error: err,
        });
    }
}