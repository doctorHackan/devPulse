import { sql } from "../../db";
import type { IIssue } from "./issue.interface";


const createIssue = async(payload : IIssue)=>{
    const {title, description, type, reporter_id } = payload;
    let {status} = payload;

    if(!status) status = "open";

    const result = await sql`
        INSERT INTO issues (title, description, type, status, reporter_id)
        VALUES (${title}, ${description}, ${type}, ${status}, ${reporter_id})
        RETURNING *
    `
    return result[0];
}


export const issueService = {
    createIssue,
}