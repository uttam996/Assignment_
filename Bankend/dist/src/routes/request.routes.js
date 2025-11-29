"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestRouter = void 0;
const express_1 = __importDefault(require("express"));
const request_controller_1 = require("../controller/request.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const chekrole_middleware_1 = require("../middleware/chekrole.middleware");
exports.requestRouter = express_1.default.Router();
exports.requestRouter.post("/create", auth_middleware_1.authenticateToken, (0, chekrole_middleware_1.checkRole)("EMPLOYEE"), request_controller_1.CreateRequest);
exports.requestRouter.patch("/update", auth_middleware_1.authenticateToken, (0, chekrole_middleware_1.checkRole)("MANAGER"), request_controller_1.ApproveOrRejectRequest);
exports.requestRouter.post("/close", auth_middleware_1.authenticateToken, (0, chekrole_middleware_1.checkRole)("EMPLOYEE"), request_controller_1.CloseRequest);
exports.requestRouter.get("/", auth_middleware_1.authenticateToken, request_controller_1.getAllRequests);
exports.requestRouter.get("/log/:request_id", auth_middleware_1.authenticateToken, request_controller_1.getRequestLog);
