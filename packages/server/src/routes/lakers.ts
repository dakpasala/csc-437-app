import express, { Request, Response } from "express";
import { LakersData } from "../models/lakers";

import Lakers from "../services/lakers-svc";

const router = express.Router();

router.get("/", (_, res: Response) => {
  Lakers.index()
    .then((list: LakersData[]) => res.send(list))
    .catch((err) => res.status(500).send(err));
});

router.get("/:id", (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  Lakers.get(id)
    .then((dest: LakersData | null) => {
      if (!dest) res.status(404).send();
      else res.send(dest)
    })
    .catch((err) => res.status(404).send(err));
});

router.post("/", (req: Request, res: Response) => {
  const newLakersData = req.body;

  Lakers.create(newLakersData)
    .then((destination: LakersData) =>
      res.status(201).json(destination)
    )
    .catch((err) => res.status(500).send(err));
});

router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const newDestination = req.body;

  // looks like id.toString() is needed he
  Lakers.update(id.toString(), newDestination)
    .then((lakersData: LakersData) => res.json(lakersData))
    .catch((err) => res.status(404).end());
});

export default router;