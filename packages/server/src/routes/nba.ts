import express, { Request, Response } from "express";
import { NBAData } from "../models/nba";

import NBA from "../services/nba-svc";

const router = express.Router();

router.get("/", (_, res: Response) => {
  NBA.index()
    .then((list: NBAData[]) => res.send(list))
    .catch((err) => res.status(500).send(err));
});

router.get("/:id", (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  NBA.get(id)
    .then((dest: NBAData | null) => {
      if (!dest) res.status(404).send();
      else res.send(dest);
    })
    .catch((err) => res.status(404).send(err));
});

router.post("/", (req: Request, res: Response) => {
  const newNBAData = req.body;

  NBA.create(newNBAData)
    .then((destination: NBAData) => res.status(201).json(destination))
    .catch((err) => res.status(500).send(err));
});

router.put("/:id", (req: Request, res: Response) => {
  const id = req.params.id as string;
  const updatedNBAData = req.body;

  NBA.update(id, updatedNBAData)
    .then((nba) => res.json(nba))
    .catch((err) => res.status(404).send(err));
});
router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  NBA.remove(id.toString())
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).send(err));
});

export default router;
