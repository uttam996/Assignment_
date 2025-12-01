"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllRequests = exports.getRequestLog = exports.CloseRequest = exports.ApproveOrRejectRequest = exports.CreateRequest = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../db"));
const schema_1 = require("../db/schema");
const request_validation_1 = require("../validation/request.validation");
const gel_core_1 = require("drizzle-orm/gel-core");
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
const getAllRequests = async (req, res) => {
    try {
        const { page, limit, status } = req.query;
        // Type casting and safe defaults
        const pageNum = page ? parseInt(page) : 1;
        const limitNum = limit ? parseInt(limit) : 10;
        const offset = (pageNum - 1) * limitNum;
        const statusFilter = status;
        const whereCondition = statusFilter ? (0, drizzle_orm_1.eq)(schema_1.RequestSchema.status, statusFilter) : undefined;
        const AssignedUser = (0, gel_core_1.alias)(schema_1.UserSchema, "assigned_to");
        const CreatedUser = (0, gel_core_1.alias)(schema_1.UserSchema, "created_by");
        const ManagerUser = (0, gel_core_1.alias)(schema_1.UserSchema, "manager_id");
        const requests = await db_1.default
            .select({
            id: schema_1.RequestSchema.id,
            title: schema_1.RequestSchema.title,
            description: schema_1.RequestSchema.description,
            status: schema_1.RequestSchema.status,
            assigned_to: {
                id: AssignedUser.id,
                name: AssignedUser.name,
            },
            created_by: {
                id: CreatedUser.id,
                name: CreatedUser.name,
            },
            manager: {
                id: ManagerUser.id || null,
                name: ManagerUser.name || null,
            },
            created_at: schema_1.RequestSchema.created_at,
            updated_at: schema_1.RequestSchema.updated_at,
        })
            .from(schema_1.RequestSchema)
            .leftJoin(AssignedUser, (0, drizzle_orm_1.eq)(schema_1.RequestSchema.assigned_to, AssignedUser.id))
            .leftJoin(CreatedUser, (0, drizzle_orm_1.eq)(schema_1.RequestSchema.created_by, CreatedUser.id))
            .leftJoin(ManagerUser, (0, drizzle_orm_1.eq)(AssignedUser.manager_id, ManagerUser.id))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.RequestSchema.created_at))
            .limit(limitNum)
            .offset(offset)
            .where(whereCondition);
        // 4. Total Count Query: Apply filtering, but REMOVE LIMIT/OFFSET
        const total = await db_1.default
            .select({ count: (0, drizzle_orm_1.sql) `count(*)` })
            .from(schema_1.RequestSchema)
            .where(whereCondition); // Apply status filtering
        // 5. Send the response
        return res.status(200).json({
            requests,
            total: total[0]?.count || 0, // Safely access the count
            page: pageNum,
            limit: limitNum,
        });
    }
    catch (error) {
        console.error("Error fetching requests:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};
exports.getAllRequests = getAllRequests;
