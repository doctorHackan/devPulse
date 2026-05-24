import config from "../../config";
import { sql } from "../../db";
import type { IUser } from "../user/user.interface";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const registerUser = async (payload : IUser)=>{
    const {name, email, password} = payload;
    let {role} = payload;

    if(!role) role = "contributor";

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await sql`
        INSERT INTO users (name,email,password, role)
        VALUES (${name},${email},${hashedPassword},${role})
        RETURNING *
    `
    const user = result[0];

    if (!user) {
        throw new Error("Failed to create user");
    }


    const { password: _, ...userWithoutPassword } = user;
    
    return userWithoutPassword;

};

const loginUser = async (payload : {email: string, password : string}) =>{
    
    const {email,password} = payload;

    const result = await sql`
        SELECT * FROM users
        WHERE email = ${email}
    `
    if(result.length === 0){
        throw new Error("Invalid Credentials");
    }

    const user = result[0]!;
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