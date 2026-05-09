import { Schema, model } from "mongoose";
import { LakersData } from "../models/lakers";

const lakersSchema = new Schema<LakersData>(
  {
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
  },
  { collection: "Lakers" }
);

const LakersModel = model<LakersData>(
  "Lakers",
  lakersSchema
);

function index(): Promise<LakersData[]> {
  return LakersModel.find();
}

function get(id: string): Promise<LakersData | null> {
  return LakersModel.findOne({ id });
}

export default { index, get };