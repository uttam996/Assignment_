import { AuthRequest } from "./auth.middleware";
import { NextFunction, Response } from "express";

export  const checkRole = (role: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: `Access denied for Role ${req.user.role}` });
    }
    next();
  };
};