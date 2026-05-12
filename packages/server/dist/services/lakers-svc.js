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
            href: String
        }
    ],
    Games: [
        {
            game: String,
            href: String
        }
    ],
    Championships: [
        {
            championship: String,
            href: String
        }
    ]
}, { collection: "Lakers" });
const LakersModel = (0, mongoose_1.model)("Lakers", lakersSchema);
function index() {
    return LakersModel.find();
}
function get(id) {
    return LakersModel.findOne({ id });
}
function create(json) {
    const t = new LakersModel(json);
    return t.save();
}
function update(id, lakersData) {
    return LakersModel.findOneAndUpdate({ id }, lakersData, { new: true })
        .then((updated) => {
        if (!updated)
            throw `${id} not updated`;
        else
            return updated;
    });
}
function remove(id) {
    return LakersModel.findOneAndDelete({ id }).then((deleted) => {
        if (!deleted)
            throw `${id} not deleted`;
    });
}
exports.default = { index, get, create, update, remove };
