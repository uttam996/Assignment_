"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLoginValidation = exports.userValidationSchema = void 0;
const zod_1 = require("zod");
exports.userValidationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.email("Invalid email"),
    password: zod_1.z.string().min(6, "Password must be at least 6 chars"),
    role: zod_1.z.enum(["EMPLOYEE", "MANAGER"]).default("EMPLOYEE"),
    manager_id: zod_1.z.string().optional(),
});
exports.userLoginValidation = zod_1.z.object({
    email: zod_1.z.email("Invalid email"),
    password: zod_1.z.string().min(6, "Password must be at least 6 chars"),
});
