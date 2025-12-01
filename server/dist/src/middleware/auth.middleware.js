"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../db"));
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Access token required" });
        }
        const token = authHeader.split(" ")[1];
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "secret");
        }
        catch (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }
        const [user] = await db_1.default
            .select()
            .from(schema_1.UserSchema)
            .where((0, drizzle_orm_1.eq)(schema_1.UserSchema.id, decoded.id))
            .limit(1);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        req.user = decoded;
        return next(); // <- MUST RETURN
    }
    catch (error) {
        console.error("AUTH ERROR:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.authenticateToken = authenticateToken;
const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({ message: "Insufficient permissions" });
            return;
        }
        next();
    };
};
exports.authorizeRole = authorizeRole;
