import { Request, Response, NextFunction } from "express";
import { matchedData, validationResult } from "express-validator";
import bcryptjs from "bcryptjs";

import * as db from "../db/init.db";
import { AuthData, ResponseData } from "../types/global.type";

const DB_SCHEMA: string = String(process.env.DB_SCHEMA);

export const handelSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    const signUpPlayerData = matchedData<AuthData>(req);
    // find if player name already exist or not
    const findPlayerNameQuery = `SELECT * FROM ${DB_SCHEMA}.player WHERE player.player_name = $1`;
    const findPlayerNameQueryResult = await db.query(findPlayerNameQuery, [
      signUpPlayerData.player_name || "",
    ]);
    if (
      findPlayerNameQueryResult.rowCount &&
      findPlayerNameQueryResult.rowCount > 0
    ) {
      const responseData: ResponseData = {
        statusCode: 409,
        message: "Player name already exists",
      };
      res.status(responseData.statusCode).json(responseData);
      return;
    }
    // Check if the player's email already exists in the database
    const findPlayerEmailQuery = `SELECT * FROM ${DB_SCHEMA}.player WHERE player.email = $1`;
    const findPlayerEmailQueryResult = await db.query(findPlayerEmailQuery, [
      signUpPlayerData.email || "",
    ]);
    if (
      findPlayerEmailQueryResult.rowCount &&
      findPlayerEmailQueryResult.rowCount > 0
    ) {
      const responseData: ResponseData = {
        statusCode: 409,
        message: "Email already exists",
      };
      res.status(responseData.statusCode).json(responseData);
      return;
    }
    const hashedPassword = bcryptjs.hashSync(signUpPlayerData.password);
    const storePlayerDataQuery = `INSERT INTO ${DB_SCHEMA}.player (player_name, email, password) VALUES($1,$2,$3) RETURNING player_name,email`;
    const storePlayerDataQueryResult = await db.query(storePlayerDataQuery, [
      signUpPlayerData.player_name || "",
      signUpPlayerData.email,
      hashedPassword,
    ]);
    if (
      storePlayerDataQueryResult.rowCount &&
      storePlayerDataQueryResult.rowCount > 0
    ) {
      const responseData: ResponseData = {
        statusCode: 201,
        message: "Player registered successfully",
        data: storePlayerDataQueryResult.rows[0],
      };
      res.status(responseData.statusCode).json(responseData);
    }
  } else {
    res.json(result.array({ onlyFirstError: true }));
  }
};
