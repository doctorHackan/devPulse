import express from "express";
import auth from "../../middleware/auth";
import {  ROLE } from "../../types";
import { issueController } from "./issue.controller";

const route = express.Router();

route.post("/",auth(ROLE.contributor, ROLE.maintainer),issueController.createIssue);
route.get("/",issueController.getAllIssues);

export const issueRoute = route;