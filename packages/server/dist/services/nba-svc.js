"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const lakersSchema = new mongoose_1.Schema({
    id: String,
    Coach: String,
    Conference: String,
    Players: [
        {
            player: String,
            href: String,
        },
    ],
    Games: [
        {
            game: String,
            href: String,
            "opponent-id": String,
        },
    ],
    Championships: [
        {
            championship: String,
            href: String,
        },
    ],
}, { collection: "Lakers" });
const NBAModel = (0, mongoose_1.model)("Lakers", lakersSchema);
function index() {
    return NBAModel.find();
}
function get(id) {
    return NBAModel.findOne({ id });
}
function create(json) {
    const t = new NBAModel(json);
    return t.save();
}
function update(id, nbaData) {
    return NBAModel.findOneAndUpdate({ id }, nbaData, { new: true }).then((updated) => {
        if (!updated)
            throw `${id} not updated`;
        else
            return updated;
    });
}
function remove(id) {
    return NBAModel.findOneAndDelete({ id }).then((deleted) => {
        if (!deleted)
            throw `${id} not deleted`;
    });
}
exports.default = { index, get, create, update, remove };
