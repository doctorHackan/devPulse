import { pool} from "../../db";
import type { IIssue } from "./issue.interface";


const createIssue = async(payload : IIssue)=>{
    const {title, description, type, reporter_id } = payload;
    let {status} = payload;

    if(!status) status = "open";

    const result = await pool.query(`
        INSERT INTO issues (title, description, type, status, reporter_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `,[title,description,type,status,reporter_id]);
    return result.rows[0];
}



interface IIssueQuery {
    sort?: string;
    type?: string;
    status?: string;
}

const getAllIssuesFromDB = async (queryParams: IIssueQuery) => {
    const { sort, type, status } = queryParams;

    let sqlQuery = `SELECT * FROM issues WHERE 1=1`;
    const values: any[] = [];
    let paramIndex = 1;

    if (type) {
        sqlQuery += ` AND type = $${paramIndex}`;
        values.push(type);
        paramIndex++;
    }

    if (status) {
        sqlQuery += ` AND status = $${paramIndex}`;
        values.push(status);
        paramIndex++;
    }
    if (sort === "oldest") {
        sqlQuery += ` ORDER BY created_at ASC`;
    } else {
        sqlQuery += ` ORDER BY created_at DESC`;
    }

    const result = await pool.query(sqlQuery, values);
    
    const issues = result.rows;
    if (issues.length === 0) {
        return [];
    }

    const reporterIds = [...new Set(issues.map(issue => issue.reporter_id))];

    const userResult = await pool.query(
        `SELECT id, name, role FROM users WHERE id = ANY($1::int[])`,
        [reporterIds]
    );
    const users = userResult.rows;

    const userMap = new Map();
    users.forEach(user => {
        userMap.set(user.id, {
            id: user.id,
            name: user.name,
            role: user.role
        });
    });

    const finalResult = issues.map(issue => {
        const { reporter_id, ...issueData } = issue; 
        
        return {
            ...issueData,
            reporter: userMap.get(reporter_id) || null // Attach the user object
        };
    });

    return finalResult;
};


export const issueService = {
    createIssue,
    getAllIssuesFromDB,
}