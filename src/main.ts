import express, { Request, Response, NextFunction } from "express";

import { playerRoute } from "./routes/player.route";

const PORT: number = Number(process.env.PORT || 3000);
const HOST: string = "localhost";
const PROTOCOL: string = "http";
const app = express();

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ msg: "Hello" });
});

app.use("/player", playerRoute);

app.listen(PORT, HOST, () => {
  console.log(`Server is running on ${PROTOCOL}://${HOST}:${PORT}`);
});
