"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const node_postgres_1 = require("drizzle-orm/node-postgres");
console.log(process.env.DATABASE_URL);
const db = (0, node_postgres_1.drizzle)(process.env.DATABASE_URL);
exports.default = db;
