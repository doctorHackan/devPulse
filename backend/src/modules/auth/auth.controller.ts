import type { Request, Response } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utility/sendResponse";


const signUp = async (req : Request, res : Response)=>{
    try{
        const result = await authService.registerUser(req.body);
        
        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "User Registered successfully!",
            data: result,
        });
    }
    catch(err : any){
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: err.message,
            error: err,
        });
    }

};

const login = async (req : Request, res : Response)=>{
    try{
        const data = await authService.loginUser(req.body);
        sendResponse(res,{
            statusCode: 200,
            success: true,
            message: "Login successful",
            data: data,
        });
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

export const authController = {
    signUp,
    login,
}