"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const morgan_1 = __importDefault(require("morgan"));
const config_1 = require("./config/config");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use("/api/v1", routes_1.default);
app.listen(config_1.Config.PORT, () => {
    console.log("Server is running on port 3000");
});
