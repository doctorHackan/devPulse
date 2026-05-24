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
            reporter: userMap.get(reporter_id) || null 
        };
    });

    return finalResult;
};


const getSingleIssueFromDB = async (id: string) => {
    const issueResult = await pool.query(
        `SELECT * FROM issues WHERE id = $1`,
        [id]
    );
    const issue = issueResult.rows[0];

    if (!issue) {
        return null;
    }

    const userResult = await pool.query(
        `SELECT id, name, role FROM users WHERE id = $1`,
        [issue.reporter_id]
    );
    const reporter = userResult.rows[0];

    const { reporter_id, ...issueData } = issue;

    return {
        ...issueData,
        reporter: reporter || null 
    };
};

const updateIssue = async(id : string, payload : {
    title : string,
    description : string,
    type : "bug" | "feature_request"
}) => {

    // console.log("here");

    const { title, description, type } = payload;
    
    const updateResult = await pool.query(
        `
            UPDATE issues
            SET 
                title = COALESCE($1, title),
                description = COALESCE($2, description),
                type = COALESCE($3, type),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $4
            RETURNING *
        `,
        [title, description, type, id]);

    return updateResult.rows[0];

};

const deleteIssueFromDB = async (id : string) =>{
    await pool.query(`
            DELETE FROM issues
            WHERE id = $1
        `,[id]);
};


export const issueService = {
    createIssue,
    getAllIssuesFromDB,
    getSingleIssueFromDB,
    updateIssue,
    deleteIssueFromDB
}