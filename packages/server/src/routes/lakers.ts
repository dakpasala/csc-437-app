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
    .then((dest: LakersData | undefined) => {
      if (!dest) res.status(404).send();
      else res.send(dest)
    })
    .catch((err) => res.status(404).send(err));
});

export default router;