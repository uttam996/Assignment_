import express from "express";
import { login, register, verifyToken } from "../controller/auth.controller";


export const authRouter = express.Router();



authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/token/verify', verifyToken);
