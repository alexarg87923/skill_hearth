"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/users", user_routes_1.default);
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({ message: error.message });
});
exports.default = app;
