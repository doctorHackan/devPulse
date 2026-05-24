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
        // console.error(err);
        res.status(500).json({
            success: false,
            message: err.message,
            error: err
        });
    }
};


const getSingleIssue = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id || Array.isArray(id)) {
            return sendResponse(res, {
                statusCode: 400,
                success: false,
                message: "Issue ID is required",
            });
        }

        const result = await issueService.getSingleIssueFromDB(id);

        if (!result) {
            return sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Issue not found",
            });
        }

        res.status(200).json({
            success : true,
            data : result,
        })
    } catch (err: any) {
        // console.error(err);
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: "Failed to retrieve the issue",
            error: err.message
        });
    }
};

const updateIssue = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        const user = req.user;

        // console.log("here");
        const result = await issueService.updateIssue(id as string, req.body);

        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issue updated successfully",
            data: result,
        });
    }
    catch(err : any){
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: "Failed to Update the issue",
            error: err.message
        });
    }
}

const deleteIssue =async (req: Request, res: Response)=> {
    const {id}  = req.params;

    try{
        await issueService.deleteIssueFromDB(id as string);
        sendResponse(res,{
            statusCode: 200,
            success : true,
            message : "Issue deleted successfully",
        });
    }
    catch(err : any){
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: "Failed to Update the issue",
            error: err.message
        });
    }
}

export const issueController = {
    createIssue,
    getAllIssues,
    getSingleIssue,
    updateIssue,
    deleteIssue,
}