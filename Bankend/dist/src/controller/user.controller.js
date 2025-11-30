"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetListUser = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../db"));
const schema_1 = require("../db/schema");
const GetListUser = async (req, res) => {
    try {
        let { page, limit, search } = req.query;
        page = page || 1;
        limit = limit || 10;
        search = search || "";
        const user = await db_1.default
            .select()
            .from(schema_1.UserSchema)
            .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.like)(schema_1.UserSchema.name, `%${search}%`), (0, drizzle_orm_1.like)(schema_1.UserSchema.email, `%${search}%`)))
            .limit(Number(limit) || 10)
            .offset((Number(page) - 1) * Number(limit) || 0);
        return res.status(200).json({ message: "User list", data: user });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.GetListUser = GetListUser;
