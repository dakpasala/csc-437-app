"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongo_1 = require("./services/mongo");
const nba_1 = __importDefault(require("./routes/nba"));
const auth_1 = __importDefault(require("./routes/auth"));
const auth_2 = require("./routes/auth");
const promises_1 = __importDefault(require("node:fs/promises"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";
app.use(express_1.default.static(staticDir));
app.use(express_1.default.json());
(0, mongo_1.connect)("LakersData");
app.use("/auth", auth_1.default);
app.use("/api/nba", auth_2.authenticateUser, nba_1.default);
app.get("/", (_req, res) => {
    res.redirect("/app");
});
app.get("/hello", (req, res) => {
    res.send("Hello, World");
});
// app.get("/api/lakers/:id", (req: Request<{ id: string }>, res: Response) => {
//   const { id } = req.params;
//   Lakers.get(id)
//     .then((lake: LakersData | null) => {
//       if (!lake) res.status(404).send();
//       else res.send(lake);
//     })
//     .catch((err) => res.status(500).send(err));
// });
// app.get("/api/laker", (req: Request, res: Response) => {
//   Lakers.index()
//     .then((list: LakersData[]) => {
//       res.send({ count: list.length, data: list});
//     });
// });
app.use("/app", (req, res) => {
    const indexHtml = path_1.default.resolve(staticDir, "index.html");
    promises_1.default.readFile(indexHtml, { encoding: "utf8" }).then((html) => res.send(html));
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
