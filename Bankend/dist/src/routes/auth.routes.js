"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controller/auth.controller");
exports.authRouter = express_1.default.Router();
exports.authRouter.post('/register', auth_controller_1.register);
exports.authRouter.post('/login', auth_controller_1.login);
exports.authRouter.get('/token/verify', auth_controller_1.verifyToken);
