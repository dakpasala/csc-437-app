"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
__exportStar(require("./models/lakers"), exports);
const lakers_svc_1 = __importDefault(require("./services/lakers-svc"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";
app.use(express_1.default.static(staticDir));
app.use(express_1.default.json());
app.get("/hello", (req, res) => {
    res.send("Hello, World");
});
app.get("/api/lakers/:id", (req, res) => {
    const { id } = req.params;
    const data = lakers_svc_1.default.get(id);
    if (data)
        res.send(data);
    else
        res.status(404).send();
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
