"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const drizzle_orm_1 = require("drizzle-orm");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const db_1 = __importDefault(require("../db"));
const schema_1 = require("../db/schema");
const genrateJwtToken_1 = require("../utils/genrateJwtToken");
const user_validation_1 = require("../validation/user.validation");
const config_1 = require("../config/config");
const register = async (req, res) => {
    try {
        const validatedData = user_validation_1.userValidationSchema.parse(req.body);
        const [existingUser] = await db_1.default
            .select()
            .from(schema_1.UserSchema)
            .where((0, drizzle_orm_1.eq)(schema_1.UserSchema.email, validatedData.email))
            .limit(1);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt_1.default.hash(validatedData.password, 10);
        const newUser = await db_1.default
            .insert(schema_1.UserSchema)
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
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ message: error.issues });
        }
        else {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const data = user_validation_1.userLoginValidation.parse(req.body);
        const [user] = await db_1.default
            .select()
            .from(schema_1.UserSchema)
            .where((0, drizzle_orm_1.eq)(schema_1.UserSchema.email, data.email))
            .limit(1);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const isMatch = await bcrypt_1.default.compare(data.password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = (0, genrateJwtToken_1.generateToken)({
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            manager_id: user?.manager_id,
        });
        user.token = token;
        const result = await db_1.default
            .update(schema_1.UserSchema)
            .set({ token })
            .where((0, drizzle_orm_1.eq)(schema_1.UserSchema.id, user.id));
        return res
            .status(200)
            .json({ message: "Login successful", data: user, token });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.login = login;
const verifyToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.Config.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }
        return res.status(200).json({ message: "Token is valid", user: decoded, token });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.verifyToken = verifyToken;
