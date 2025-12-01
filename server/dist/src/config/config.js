"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
exports.Config = {
    "DATABASE_URL": process.env.DATABASE_URL,
    "JWT_SECRET": process.env.JWT_SECRET || "your_secret_key",
    "PORT": process.env.PORT || 3000
};
