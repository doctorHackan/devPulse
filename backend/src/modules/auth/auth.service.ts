import config from "../../config";
import { pool } from "../../db";
import type { IUser } from "../user/user.interface";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const registerUser = async (payload : IUser)=>{
    const {name, email, password} = payload;
    let {role} = payload;
    
    const checkResult = await pool.query(`
        SELECT * FROM users
        WHERE email = $1
    `,[email]);

    if(checkResult.rows.length == 1) throw new Error("Email already registered.");
    

    if(!role) role = "contributor";

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(`
        INSERT INTO users (name,email,password, role)
        VALUES ($1,$2,$3,$4)
        RETURNING *
    `,[name,email,hashedPassword,role]);
    const user = result.rows[0];

    if (!user) {
        throw new Error("Failed to create user");
    }


    const { password: _, ...userWithoutPassword } = user;
    
    return userWithoutPassword;

};

const loginUser = async (payload : {email: string, password : string}) =>{
    
    const {email,password} = payload;

    const result = await pool.query(`
        SELECT * FROM users
        WHERE email = $1
    `,[email]);
    if(result.rows.length === 0){
        throw new Error("Invalid Credentials");
    }

    const user = result.rows[0]!;
    const matchPassword = await bcrypt.compare(password, user.password);

    if(!matchPassword)
    {
        throw new Error("Invalid Credentials");
    }

    const jwtpayload = {
        id: user.id,
        name: user.name,
        role: user.role,
    };

    const accessToken = jwt.sign(jwtpayload, config.secret as string, {
        expiresIn: "1d",
    });
    
    return {token:accessToken,user};
}

export const authService = {
    registerUser,
    loginUser,
}