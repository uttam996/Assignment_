"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = require("./user.routes");
const request_routes_1 = require("./request.routes");
const router = (0, express_1.Router)();
router.use("/users", user_routes_1.userRouter);
router.use("/requests", request_routes_1.requestRouter);
exports.default = router;
