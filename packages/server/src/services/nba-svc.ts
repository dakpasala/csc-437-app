import { Schema, model } from "mongoose";
import { NBAData } from "../models/nba";

const lakersSchema = new Schema<NBAData>(
  {
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
  },
  { collection: "Lakers" },
);

const NBAModel = model<NBAData>("Lakers", lakersSchema);

function index(): Promise<NBAData[]> {
  return NBAModel.find();
}

function get(id: string): Promise<NBAData | null> {
  return NBAModel.findOne({ id });
}

function create(json: NBAData): Promise<NBAData> {
  const t = new NBAModel(json);
  return t.save();
}

function update(id: String, nbaData: NBAData): Promise<NBAData> {
  return NBAModel.findOneAndUpdate({ id }, nbaData, { new: true }).then(
    (updated) => {
      if (!updated) throw `${id} not updated`;
      else return updated as NBAData;
    },
  );
}

function remove(id: String): Promise<void> {
  return NBAModel.findOneAndDelete({ id }).then((deleted) => {
    if (!deleted) throw `${id} not deleted`;
  });
}

export default { index, get, create, update, remove };
