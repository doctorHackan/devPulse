import type { Response } from "express";

type TResponse<T> = {
    statusCode: number;
    success: boolean;
    message: string;
    data?: T | undefined;
    error?: any;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
    const response: any = {
        success: data.success,
        message: data.message,
    };

    if (data.data !== undefined) {
        response.data = data.data;
    }

    if (data.error !== undefined) {
        response.error = data.error;
    }

    res.status(data.statusCode).json(response);
};

export default sendResponse;