"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequestLog = exports.getAllRequests = exports.CloseRequest = exports.ApproveOrRejectRequest = exports.CreateRequest = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../db"));
const schema_1 = require("../db/schema");
const request_validation_1 = require("../validation/request.validation");
const CreateRequest = async (req, res) => {
    try {
        const body = request_validation_1.requestValidationSchema.parse({
            ...req.body,
            created_by: req.user.id,
        });
        const [assigned_user] = await db_1.default
            .select()
            .from(schema_1.UserSchema)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.UserSchema.id, body.assigned_to), (0, drizzle_orm_1.eq)(schema_1.UserSchema.role, "EMPLOYEE")))
            .limit(1);
        if (!assigned_user) {
            return res
                .status(400)
                .json({ message: "Assigned Employee not found or not an employee" });
        }
        await db_1.default.transaction(async (tx) => {
            const result = await tx.insert(schema_1.RequestSchema).values(body).returning();
            const logdata = request_validation_1.requestLogValidationSchema.parse({
                request_id: result[0].id,
                title: "Request created",
                description: `Request created by ${req.user.name} and assigned to ${assigned_user.name}`,
                created_by: req.user.id,
            });
            await tx.insert(schema_1.RequestSchemaLog).values(logdata);
        });
        return res.status(201).json({
            message: "Request created successfully",
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.CreateRequest = CreateRequest;
const ApproveOrRejectRequest = async (req, res) => {
    try {
        const data = request_validation_1.requestUpdateValidationSchema.parse(req.body);
        const { request_id, status, remarks } = data;
        const [request] = await db_1.default
            .select()
            .from(schema_1.RequestSchema)
            .where((0, drizzle_orm_1.eq)(schema_1.RequestSchema.id, data.request_id))
            .limit(1);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }
        const [assigned_user] = await db_1.default
            .select()
            .from(schema_1.UserSchema)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.UserSchema.id, request.assigned_to), (0, drizzle_orm_1.eq)(schema_1.UserSchema.role, "EMPLOYEE")))
            .limit(1);
        if (!assigned_user) {
            return res
                .status(400)
                .json({ message: "Assigned Employee not found or not an employee" });
        }
        if (assigned_user.manager_id !== req.user.id) {
            return res.status(400).json({ message: "You are not his/her manager" });
        }
        if (request.status !== "CREATED") {
            return res
                .status(400)
                .json({ message: "Request is  Already Approved/Rejected or Closed" });
        }
        await db_1.default.transaction(async (tx) => {
            // 1. Update request status
            const updated = await tx
                .update(schema_1.RequestSchema)
                .set({
                status,
                updated_at: new Date(),
            })
                .where((0, drizzle_orm_1.eq)(schema_1.RequestSchema.id, request_id))
                .returning();
            if (updated.length === 0) {
                throw new Error("Request not found");
            }
            // 2. Insert log
            await tx.insert(schema_1.RequestSchemaLog).values({
                request_id,
                title: status === "APPROVED" ? "Request Approved" : "Request Rejected",
                description: status === "APPROVED"
                    ? `Approved by ${req.user.name}`
                    : `Rejected by ${req.user.name} ${remarks ? `: ${remarks}` : ""}`,
                created_by: req.user.id,
            });
        });
        return res.status(200).json({
            message: `Request ${req.body.status.toLowerCase()} successfully`,
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.ApproveOrRejectRequest = ApproveOrRejectRequest;
const CloseRequest = async (req, res) => {
    try {
        const { request_id } = req.body;
        const [request] = await db_1.default
            .select()
            .from(schema_1.RequestSchema)
            .where((0, drizzle_orm_1.eq)(schema_1.RequestSchema.id, request_id))
            .limit(1);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }
        if (request.status !== "APPROVED") {
            return res
                .status(400)
                .json({ message: "Request is not Approved or Rejected" });
        }
        if (request.assigned_to !== req.user.id) {
            return res
                .status(400)
                .json({ message: "You are not the assigned employee" });
        }
        await db_1.default.transaction(async (tx) => {
            // 1. Update request status
            const updated = await tx
                .update(schema_1.RequestSchema)
                .set({
                status: "CLOSED",
                updated_at: new Date(),
            })
                .where((0, drizzle_orm_1.eq)(schema_1.RequestSchema.id, request_id))
                .returning();
            if (updated.length === 0) {
                throw new Error("Request not found");
            }
            // 2. Insert log
            await tx.insert(schema_1.RequestSchemaLog).values({
                request_id,
                title: "Request Closed",
                description: `Closed by ${req.user.name}`,
                created_by: req.user.id,
            });
        });
        return res.status(200).json({
            message: "Request closed successfully",
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.CloseRequest = CloseRequest;
const getAllRequests = async (req, res) => {
    try {
        const { page, limit, status } = req.query;
        const requests = await db_1.default
            .select()
            .from(schema_1.RequestSchema)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.RequestSchema.created_at))
            .limit(limit ? parseInt(limit) : 10)
            .offset(page ? (parseInt(page) - 1) * 10 : 0);
        const total = await db_1.default
            .select({ count: (0, drizzle_orm_1.sql) `count(*)` })
            .from(schema_1.RequestSchema)
            .limit(limit ? parseInt(limit) : 10)
            .offset(page ? (parseInt(page) - 1) * 10 : 0);
        return res.status(200).json({ requests, total: total[0].count });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getAllRequests = getAllRequests;
const getRequestLog = async (req, res) => {
    try {
        const { request_id } = req.params;
        const logs = await db_1.default
            .select()
            .from(schema_1.RequestSchemaLog)
            .where((0, drizzle_orm_1.eq)(schema_1.RequestSchemaLog.request_id, request_id));
        return res.status(200).json({ logs });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getRequestLog = getRequestLog;
