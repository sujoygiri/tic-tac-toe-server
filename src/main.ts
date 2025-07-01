import express, { Request, Response, NextFunction } from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import cors from "cors";

import * as db from "./db/init.db";
import { playerRoute } from "./routes/player.route";
import { authRouter } from "./routes/auth.route";
import { initializeTableHandler } from "./db/init-table.db";
import { errorHandler, notFoundHandler } from "./utils/errorHandler.util";

const PORT: number = Number(process.env.SERVER_PORT || 3000);
const HOST: string = "localhost";
const PROTOCOL: string = "http";
const server = express();
const pgStore = connectPgSimple(session);

declare module "express-session" {
  interface SessionData {
    playerData?: {
      player_id: string;
      player_name: string;
      email: string;
    };
  }
}

server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.set("trust proxy", 1);
server.use(
  cors({
    origin: ["http://localhost:4200"],
    optionsSuccessStatus: 200,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    preflightContinue: false,
  })
);
server.use(
  session({
    secret: String(process.env.SESSION_SECRET),
    name: "_SSID",
    saveUninitialized: false,
    resave: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: Boolean(process.env.ENV === "prod"),
      priority: "high",
    },
    store: new pgStore({
      pool: db.pool,
      schemaName: String(process.env.DB_SCHEMA),
      tableName: "session",
      createTableIfMissing: true,
    }),
  })
);

server.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const currentTimeQuery = await db.query("SELECT LOCALTIME, LOCALTIMESTAMP");
  const currentTime = currentTimeQuery.rows[0];
  const dateNTime = String(currentTime.localtimestamp);
  res.json({ msg: "Hello", dateAndTime: dateNTime });
});

server.get("/initialize-table", initializeTableHandler);

server.use("/auth", authRouter);

server.use("/player", playerRoute);

server.use(notFoundHandler);

server.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server is running on ${PROTOCOL}://${HOST}:${PORT}`);
});
