import express, { type Request, type Response } from "express";
import { authRouter } from "./modules/auth/auth.route";
import { issueRoute } from "./modules/issue/issue.route";
import cors from "cors";
import CookieParser from "cookie-parser";
import globalErrorHandler from "./middleware/globalErroHandler";

const app = express();

app.use(express.json());
app.use(CookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);


app.get("/",(req: Request, res : Response)=>{
    res.json({
        message : "welcome"
    });
})


app.use("/api/auth",authRouter);
app.use("/api/issues",issueRoute);

app.use(globalErrorHandler);


export default app;