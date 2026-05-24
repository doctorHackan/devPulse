import express from "express";
import { authController } from "./auth.controller";

const route = express.Router();

route.post("/signup",authController.signUp);
route.post("/login",authController.login);

export const authRouter = route;