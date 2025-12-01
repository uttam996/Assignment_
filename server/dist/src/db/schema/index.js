"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestSchemaLog = exports.RequestSchema = exports.status = exports.UserSchema = exports.role = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.role = (0, pg_core_1.pgEnum)("role", ["EMPLOYEE", "MANAGER"]);
exports.UserSchema = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey().notNull().unique(),
    name: (0, pg_core_1.varchar)("name", { length: 100 }).notNull(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).notNull().unique(),
    role: (0, exports.role)("role").notNull(),
    password: (0, pg_core_1.text)("password").notNull(),
    manager_id: (0, pg_core_1.uuid)("manager_id").references(() => exports.UserSchema.id),
    token: (0, pg_core_1.text)("token"),
});
exports.status = (0, pg_core_1.pgEnum)("status", ["CREATED", "APPROVED", "REJECTED", "CLOSED"]);
exports.RequestSchema = (0, pg_core_1.pgTable)("requests", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey().notNull().unique(),
    title: (0, pg_core_1.text)("title").notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    status: (0, exports.status)("status").notNull().default("CREATED"),
    created_by: (0, pg_core_1.uuid)("created_by").references(() => exports.UserSchema.id).notNull(),
    assigned_to: (0, pg_core_1.uuid)("assigned_to").references(() => exports.UserSchema.id).notNull(),
    created_at: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updated_at: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
exports.RequestSchemaLog = (0, pg_core_1.pgTable)("request_logs", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey().notNull().unique(),
    request_id: (0, pg_core_1.uuid)("request_id").references(() => exports.RequestSchema.id),
    title: (0, pg_core_1.varchar)("title", { length: 100 }).notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    created_by: (0, pg_core_1.uuid)("created_by").references(() => exports.UserSchema.id),
    created_at: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
