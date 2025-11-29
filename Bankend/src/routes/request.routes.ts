import express from "express";
import {
  ApproveOrRejectRequest,
  CloseRequest,
  CreateRequest,
  getAllRequests,
  getRequestLog,
} from "../controller/request.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { checkRole } from "../middleware/chekrole.middleware";

export const requestRouter = express.Router();

requestRouter.post(
  "/create",
  authenticateToken,
  checkRole("EMPLOYEE"),
  CreateRequest
);
requestRouter.patch(
  "/update",
  authenticateToken,
  checkRole("MANAGER"),
  ApproveOrRejectRequest
);
requestRouter.post(
  "/close",
  authenticateToken,
  checkRole("EMPLOYEE"),
  CloseRequest
);
requestRouter.get("/", authenticateToken, getAllRequests);
requestRouter.get("/log/:request_id", authenticateToken, getRequestLog);
