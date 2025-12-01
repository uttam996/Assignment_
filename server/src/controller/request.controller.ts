import { and, desc, eq, sql } from "drizzle-orm";
import { Response } from "express";
import db from "../db";
import { RequestSchema, RequestSchemaLog, UserSchema } from "../db/schema";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  requestLogValidationSchema,
  requestUpdateValidationSchema,
  requestValidationSchema,
} from "../validation/request.validation";
import { alias } from "drizzle-orm/gel-core";

export const CreateRequest = async (req: AuthRequest, res: Response) => {
  try {
    const body = requestValidationSchema.parse({
      ...req.body,
      created_by: req.user.id,
    });

    const [assigned_user] = await db
      .select()
      .from(UserSchema)
      .where(
        and(
          eq(UserSchema.id, body.assigned_to),
          eq(UserSchema.role, "EMPLOYEE")
        )
      )
      .limit(1);
    if (!assigned_user) {
      return res
        .status(400)
        .json({ message: "Assigned Employee not found or not an employee" });
    }
    await db.transaction(async (tx) => {
      const result = await tx.insert(RequestSchema).values(body).returning();

      const logdata = requestLogValidationSchema.parse({
        request_id: result[0].id,
        title: "Request created",
        description: `Request created by ${req.user.name} and assigned to ${assigned_user.name}`,
        created_by: req.user.id,
      });


      await tx.insert(RequestSchemaLog).values(logdata);
    });

    return res.status(201).json({
      message: "Request created successfully",
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const ApproveOrRejectRequest = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const data = requestUpdateValidationSchema.parse(req.body);
    const { request_id, status, remarks } = data;

    const [request] = await db
      .select()
      .from(RequestSchema)
      .where(eq(RequestSchema.id, data.request_id))
      .limit(1);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const [assigned_user] = await db
      .select()
      .from(UserSchema)
      .where(
        and(
          eq(UserSchema.id, request.assigned_to),
          eq(UserSchema.role, "EMPLOYEE")
        )
      )
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

    await db.transaction(async (tx) => {
      // 1. Update request status
      const updated = await tx
        .update(RequestSchema)
        .set({
          status,
          updated_at: new Date(),
        })
        .where(eq(RequestSchema.id, request_id))
        .returning();

      if (updated.length === 0) {
        throw new Error("Request not found");
      }

      // 2. Insert log
      await tx.insert(RequestSchemaLog).values({
        request_id,
        title: status === "APPROVED" ? "Request Approved" : "Request Rejected",
        description:
          status === "APPROVED"
            ? `Approved by ${req.user.name}`
            : `Rejected by ${req.user.name} ${remarks ? `: ${remarks}` : ""}`,
        created_by: req.user.id,
      });
    });

    return res.status(200).json({
      message: `Request ${req.body.status.toLowerCase()} successfully`,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const CloseRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { request_id } = req.body;

    const [request] = await db
      .select()
      .from(RequestSchema)
      .where(eq(RequestSchema.id, request_id))
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

    await db.transaction(async (tx) => {
      // 1. Update request status
      const updated = await tx
        .update(RequestSchema)
        .set({
          status: "CLOSED",
          updated_at: new Date(),
        })
        .where(eq(RequestSchema.id, request_id))
        .returning();

      if (updated.length === 0) {
        throw new Error("Request not found");
      }

      // 2. Insert log
      await tx.insert(RequestSchemaLog).values({
        request_id,
        title: "Request Closed",
        description: `Closed by ${req.user.name}`,
        created_by: req.user.id,
      });
    });

    return res.status(200).json({
      message: "Request closed successfully",
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};





export const getRequestLog = async (req: AuthRequest, res: Response) => {
  try {
    const { request_id } = req.params;

    const logs = await db
      .select()
      .from(RequestSchemaLog)
      .where(eq(RequestSchemaLog.request_id, request_id))
      
    return res.status(200).json({ logs });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};


export const getAllRequests = async (req: AuthRequest, res: Response) => {
  try {
    const { page, limit, status } = req.query;

    // Type casting and safe defaults
    const pageNum = page ? parseInt(page as string) : 1;
    const limitNum = limit ? parseInt(limit as string) : 10;
    const offset = (pageNum - 1) * limitNum;
    const statusFilter = status as typeof RequestSchema.$inferSelect.status | undefined;

    const whereCondition = statusFilter ? eq(RequestSchema.status, statusFilter) : undefined;


    
    

    const AssignedUser = alias(UserSchema, "assigned_to") as typeof UserSchema
    const CreatedUser = alias(UserSchema, "created_by") as typeof UserSchema
    const ManagerUser = alias(UserSchema, "manager_id") as typeof UserSchema 
    
    const requests = await db
      .select(
        {
          id: RequestSchema.id,
          title: RequestSchema.title,
          description: RequestSchema.description,
          status: RequestSchema.status,
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
          created_at: RequestSchema.created_at,
          updated_at: RequestSchema.updated_at,
        }
      )
      .from(RequestSchema)
      .leftJoin(AssignedUser, eq(RequestSchema.assigned_to, AssignedUser.id))
      .leftJoin(CreatedUser, eq(RequestSchema.created_by, CreatedUser.id))
      .leftJoin(ManagerUser, eq(AssignedUser.manager_id, ManagerUser.id))
      .orderBy(desc(RequestSchema.created_at))
      .limit(limitNum)
      .offset(offset)
      .where(whereCondition);
    

    // 4. Total Count Query: Apply filtering, but REMOVE LIMIT/OFFSET
    const total = await db
      .select({ count: sql<number>`count(*)` })
      .from(RequestSchema)
      .where(whereCondition); // Apply status filtering
    
    // 5. Send the response
    return res.status(200).json({ 
      requests, 
      total: total[0]?.count || 0, // Safely access the count
      page: pageNum,
      limit: limitNum,
    });

  } catch (error: any) {
    console.error("Error fetching requests:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};