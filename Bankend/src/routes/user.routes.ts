import express from "express";
import { login, register, verifyToken } from "../controller/auth.controller";

export const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/token/verify', verifyToken);

