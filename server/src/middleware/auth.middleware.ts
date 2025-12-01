import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserSchema } from "../db/schema";
import { eq } from "drizzle-orm";
import db from "../db";

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: "EMPLOYEE" | "MANAGER";
        email?: string;
        name?: string;
        manager_id?: string

    };
}

export const authenticateToken = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Access token required" });
        }
        
        const token = authHeader.split(" ")[1];
        
        let decoded: any;
  
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
      } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }
  
      const [user] = await db
        .select()
        .from(UserSchema)
        .where(eq(UserSchema.id, decoded.id))
        .limit(1);
  
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
  
      req.user = decoded;
  
      return next();  // <- MUST RETURN
    } catch (error) {
      console.error("AUTH ERROR:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };
  
  

export const authorizeRole = (roles: ("EMPLOYEE" | "MANAGER")[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({ message: "Insufficient permissions" });
            return;
        }
        next();
    };
};
