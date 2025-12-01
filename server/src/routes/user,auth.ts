import express from "express";
import { GetListUser } from "../controller/user.controller";

export const userRouter = express.Router();

userRouter.get("/list", GetListUser);
