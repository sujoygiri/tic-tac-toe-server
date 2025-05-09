import { NextFunction, Request, Response } from "express";
import * as db from "../db/init.db";

const DB_SCHEMA: string = String(process.env.DB_SCHEMA);

export const createPlayerTable = async () => {
  const playerTableCreationQuery = `CREATE TABLE IF NOT EXISTS ${DB_SCHEMA}.player (
        player_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        player_name VARCHAR (50) UNIQUE NOT NULL,
        email VARCHAR (255) UNIQUE NOT NULL,
        password VARCHAR (255) UNIQUE NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        last_login TIMESTAMPTZ
    );`;
  await db.query(playerTableCreationQuery);
};

export const initializeTableHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await createPlayerTable();
    res.json({ msg: "Table creation successful" });
  } catch (error: any) {
    res.json(error);
  }
  next();
};
