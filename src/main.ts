import express, { Request, Response, NextFunction } from "express";

import { playerRoute } from "./routes/player.route";
import { authRouter } from "./routes/auth.route";
import { initializeTableHandler } from "./db/init-table.db";

const PORT: number = Number(process.env.SERVER_PORT || 3000);
const HOST: string = "localhost";
const PROTOCOL: string = "http";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ msg: "Hello" });
});

app.get("/initialize-table", initializeTableHandler);

app.use("/auth", authRouter);

app.use("/player", playerRoute);

app.listen(PORT, HOST, () => {
  console.log(`Server is running on ${PROTOCOL}://${HOST}:${PORT}`);
});
