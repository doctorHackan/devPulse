import express from "express";
import auth from "../../middleware/auth";
import {  ROLE } from "../../types";
import { issueController } from "./issue.controller";
import issueUpdateMiddleware from "../../middleware/issueUpdate";

const route = express.Router();

route.post("/",auth(ROLE.contributor, ROLE.maintainer),issueController.createIssue);
route.get("/",issueController.getAllIssues);
route.get("/:id",issueController.getSingleIssue);
route.patch("/:id",auth(ROLE.contributor, ROLE.maintainer),issueUpdateMiddleware, issueController.updateIssue);

export const issueRoute = route;