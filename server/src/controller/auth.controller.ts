import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import db from "../db";
import { UserSchema } from "../db/schema";
import { generateToken } from "../utils/genrateJwtToken";
import {
  userLoginValidation,
  userValidationSchema,
} from "../validation/user.validation";
import { Config } from "../config/config";

export const register = async (req: Request, res: Response) => {
  try {
    const validatedData = userValidationSchema.parse(req.body);

    const [existingUser] = await db
      .select()
      .from(UserSchema)
      .where(eq(UserSchema.email, validatedData.email))
      .limit(1);

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const newUser = await db
      .insert(UserSchema)
      .values({
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role,
        manager_id: validatedData.manager_id,
      
      })
      .returning();

    return res
      .status(201)
      .json({ message: "User registered successfully", userId: newUser[0].id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.issues });
    } else {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data = userLoginValidation.parse(req.body);
    const [user] = await db
      .select()
      .from(UserSchema)
      .where(eq(UserSchema.email, data.email))
      .limit(1);

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({
      id: user.id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      manager_id: user?.manager_id,
    });
    user.token = token;
    const result = await db
      .update(UserSchema)
      .set({ token })
      .where(eq(UserSchema.id, user.id));

    return res
      .status(200)
      .json({ message: "Login successful", data: user, token });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const verifyToken = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, Config.JWT_SECRET) as {
      id: string;
      email: string;
      name: string;
      role: string;
      manager_id?: string;
    };

    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    return res.status(200).json({ message: "Token is valid", user: decoded, token });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};


