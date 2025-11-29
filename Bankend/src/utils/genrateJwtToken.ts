import jwt from "jsonwebtoken";
import { Config } from "../config/config";

export const generateToken = (data :{
  id: string,
  email: string,
  name: string,
  role: string,
  manager_id?: string
}) => {
  return jwt.sign(data, Config.JWT_SECRET, {
    expiresIn: "7d",
  });
};