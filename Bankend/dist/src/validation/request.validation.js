"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogValidationSchema = exports.requestUpdateValidationSchema = exports.requestValidationSchema = void 0;
const zod_1 = require("zod");
exports.requestValidationSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, "Title is required"),
    description: zod_1.z.string().min(3, "Description is required"),
    status: zod_1.z.enum(["CREATED", "APPROVED", "REJECTED", "CLOSED"]).default("CREATED"),
    assigned_to: zod_1.z.string().min(3, "Assigned to is required"),
    created_by: zod_1.z.string()
});
exports.requestUpdateValidationSchema = zod_1.z.object({
    request_id: zod_1.z.string().min(3, "Request id is required"),
    status: zod_1.z.enum(["CREATED", "APPROVED", "REJECTED", "CLOSED"]).default("CREATED"),
    remarks: zod_1.z.string().optional(),
});
exports.requestLogValidationSchema = zod_1.z.object({
    request_id: zod_1.z.string().min(3, "Request id is required"),
    title: zod_1.z.string().min(3, "Title is required"),
    description: zod_1.z.string().min(3, "Description is required"),
    created_by: zod_1.z.string().min(3, "Created by is required"),
});
