"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetListUser = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../db/schema");
const db_1 = __importDefault(require("../db"));
const GetListUser = async (req, res) => {
    try {
        let { page, limit, search, role } = req.query;
        page = Number(page) || 1;
        limit = Number(limit) || 10;
        search = search || "";
        const u = schema_1.UserSchema;
        const m = (0, pg_core_1.alias)(schema_1.UserSchema, "manager");
        const data = await db_1.default
            .select({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            manager_id: u.manager_id,
            manager: {
                id: m.id,
                name: m.name,
                email: m.email,
                role: m.role,
            },
        })
            .from(u)
            .leftJoin(m, (0, drizzle_orm_1.eq)(u.manager_id, m.id))
            .where((0, drizzle_orm_1.and)(role ? (0, drizzle_orm_1.eq)(u.role, role) : undefined, (0, drizzle_orm_1.or)((0, drizzle_orm_1.like)(u.name, `%${search}%`), (0, drizzle_orm_1.like)(u.email, `%${search}%`))))
            .limit(limit)
            .offset((page - 1) * limit);
        return res.status(200).json({
            message: "User list",
            data,
            total: data.length, // or add total count query
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.GetListUser = GetListUser;
