"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const nba_svc_1 = __importDefault(require("../services/nba-svc"));
const router = express_1.default.Router();
router.get("/", (_, res) => {
    nba_svc_1.default.index()
        .then((list) => res.send(list))
        .catch((err) => res.status(500).send(err));
});
router.get("/:id", (req, res) => {
    const { id } = req.params;
    nba_svc_1.default.get(id)
        .then((dest) => {
        if (!dest)
            res.status(404).send();
        else
            res.send(dest);
    })
        .catch((err) => res.status(404).send(err));
});
router.post("/", (req, res) => {
    const newNBAData = req.body;
    nba_svc_1.default.create(newNBAData)
        .then((destination) => res.status(201).json(destination))
        .catch((err) => res.status(500).send(err));
});
router.put("/:id", (req, res) => {
    const id = req.params.id;
    const updatedNBAData = req.body;
    nba_svc_1.default.update(id, updatedNBAData)
        .then((nba) => res.json(nba))
        .catch((err) => res.status(404).send(err));
});
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    nba_svc_1.default.remove(id.toString())
        .then(() => res.status(204).end())
        .catch((err) => res.status(404).send(err));
});
exports.default = router;
