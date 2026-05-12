"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = authenticateUser;
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const credential_svc_ts_1 = __importDefault(require("../services/credential-svc.js"));
const router = express_1.default.Router();
dotenv_1.default.config();
const TOKEN_SECRET = process.env.TOKEN_SECRET || "NOT_A_SECRET";
function generateAccessToken(username) {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.sign({ username: username }, TOKEN_SECRET, { expiresIn: "1d" }, (error, token) => {
            if (error)
                reject(error);
            else
                resolve(token);
        });
    });
}
router.post("/register", (req, res) => {
    const { username, password } = req.body; // from form
    if (typeof username !== "string" ||
        typeof password !== "string") {
        res.status(400).send("Bad request: Invalid input data.");
    }
    else {
        credential_svc_ts_1.default
            .create(username, password)
            .then((creds) => generateAccessToken(creds.username))
            .then((token) => {
            res.status(201).send({ token: token });
        })
            .catch((err) => {
            res.status(409).send({ error: err.message });
        });
    }
});
router.post("/login", (req, res) => {
    const { username, password } = req.body; // from form
    if (!username || !password) {
        res.status(400).send("Bad request: Invalid input data.");
    }
    else {
        credential_svc_ts_1.default
            .verify(username, password)
            .then((goodUser) => generateAccessToken(goodUser))
            .then((token) => res.status(200).send({ token: token }))
            .catch((error) => res.status(401).send("Unauthorized"));
    }
});
function authenticateUser(req, res, next) {
    const authHeader = req.headers["authorization"];
    //Getting the 2nd part of the auth header (the token)
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        res.status(401).end();
    }
    else {
        jsonwebtoken_1.default.verify(token, TOKEN_SECRET, (error, decoded) => {
            if (decoded)
                next();
            else
                res.status(401).end();
        });
    }
}
exports.default = router;
