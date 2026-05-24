// import {neon} from "@neondatabase/serverless";
import {Pool} from "pg";
import config from "../config";

// export const sql = neon(config.connection_str);
export const pool = new Pool({
    connectionString : config.connection_str,
});

export const initDB = async()=>{
    await pool.query( `
        CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(32) NOT NULL,
            email VARCHAR(32) UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role VARCHAR(20) CHECK (role IN ('contributor', 'maintainer')) DEFAULT 'contributor',

            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )
    `)
    await pool.query( `
        CREATE TABLE IF NOT EXISTS issues(
            id SERIAL PRIMARY KEY,
            title VARCHAR(152) NOT NULL,
            description VARCHAR(200) NOT NULL CHECK (LENGTH(description) >= 20),
            type VARCHAR(20) CHECK (type IN ('bug', 'feature_request')),
            status VARCHAR(20) CHECK(status IN ('open', 'in_progress','resolved')) DEFAULT 'open',
            reporter_id INT NOT NULL,

            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )
    
    `)
    console.log("DB connection successfull");
};
