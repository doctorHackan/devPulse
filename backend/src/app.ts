import express, { type Request, type Response } from "express";
import { authRouter } from "./modules/auth/auth.route";

const app = express();

app.use(express.json());



app.get("/",(req: Request, res : Response)=>{
    // console.log("here");
    res.json({
        message : "welcome"
    });
})


app.use("/api/auth",authRouter);


export default app;