import type { Request, Response } from "express";
import sendResponse from "../../utility/sendResponse";
import { issueService } from "./issue.service";


const createIssue = async (req : Request, res : Response) =>{
    try{
        const reporter_id = req.user?.id;
        const result = await issueService.createIssue({...req.body,reporter_id});
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

const getAllIssues = async (req: Request, res: Response) => {
    try {
        const { sort, type, status } = req.query;

        const result = await issueService.getAllIssuesFromDB({
            sort: sort as string,
            type: type as string,
            status: status as string,
        });

        res.status(200).json({
            success : true,
            data : result,
        })
    } catch (err: any) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message,
            error: err
        });
    }
};

export const issueController = {
    createIssue,
    getAllIssues,
}