import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import Lakers from "./services/nba-svc";
import { NBAData } from "./models/nba";

import nba from "./routes/nba";
import auth from "./routes/auth";
import { authenticateUser } from "./routes/auth";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));
app.use(express.json());

connect("LakersData");

app.use("/api/nba", nba);
app.use("/auth", authenticateUser, auth);

app.get("/hello", (req: Request, res: Response) => {
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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
