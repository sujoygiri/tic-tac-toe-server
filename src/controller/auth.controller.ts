import { Request, Response, NextFunction } from "express";
import { matchedData, validationResult } from "express-validator";
import bcryptjs from "bcryptjs";

import * as db from "../db/init.db";
import {
  AuthData,
  Player,
  PlayerSessionData,
  ResponseData,
} from "../types/global.type";
import { AppError } from "../utils/errorHandler.util";

const DB_SCHEMA: string = String(process.env.DB_SCHEMA);

export const handelSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = validationResult(req);
    const signUpPlayerData = matchedData<AuthData>(req);
    if (result.isEmpty()) {
      // find if player name already exist or not
      const findPlayerNameQuery = `SELECT * FROM ${DB_SCHEMA}.player WHERE player.player_name = $1`;
      const findPlayerNameQueryResult = await db.query(findPlayerNameQuery, [
        String(signUpPlayerData.player_name),
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
        signUpPlayerData.email,
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
      // create an unique short player id
      if (process.env.PLAYER_ID_CHARACTERS) {
        const nanoIdModule = await import("nanoid");
        const { customAlphabet } = nanoIdModule;
        const nanoId = customAlphabet(process.env.PLAYER_ID_CHARACTERS, 10);
        const playerUniqueId: string = nanoId();
        const hashedPassword = bcryptjs.hashSync(signUpPlayerData.password);
        const storePlayerDataQuery = `INSERT INTO ${DB_SCHEMA}.player (player_id, player_name, email, password) VALUES($1,$2,$3,$4) RETURNING player_id,player_name,email`;
        const storePlayerDataQueryResult = await db.query(
          storePlayerDataQuery,
          [
            playerUniqueId,
            String(signUpPlayerData.player_name),
            signUpPlayerData.email,
            hashedPassword,
          ]
        );
        if (
          storePlayerDataQueryResult.rowCount &&
          storePlayerDataQueryResult.rowCount > 0
        ) {
          const responseData: ResponseData = {
            statusCode: 201,
            message: "Sign up successful",
            data: storePlayerDataQueryResult.rows[0],
          };
          req.session.playerData = responseData.data;
          res.status(responseData.statusCode).json(responseData);
        }
      } else {
        next(new AppError("Internal server error", 500));
      }
    } else {
      res.json(result.array({ onlyFirstError: true }));
    }
  } catch (error: any) {
    next(error);
  }
};

export const handelSignin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = validationResult(req);
    if (result.isEmpty()) {
      const signInPlayerData = matchedData<AuthData>(req);
      const findPlayerNameQuery = `SELECT player_id,player_name,email,password FROM ${DB_SCHEMA}.player WHERE player.email = $1`;
      const findPlayerEmailQueryResult = await db.query(findPlayerNameQuery, [
        String(signInPlayerData.email),
      ]);
      // Execute the query to find the player by their name
      if (findPlayerEmailQueryResult.rowCount === 0) {
        const responseData: ResponseData = {
          statusCode: 404,
          message: "Player not found",
        };
        res.status(responseData.statusCode).json(responseData);
        return;
      }
      const storedPlayerData: Player = findPlayerEmailQueryResult.rows[0];
      // check if password hash matched
      const isPasswordMatched: boolean = bcryptjs.compareSync(
        signInPlayerData.password,
        String(storedPlayerData.password)
      );
      if (isPasswordMatched === false) {
        const responseData: ResponseData = {
          statusCode: 401,
          message: "Wrong password",
        };
        res.status(responseData.statusCode).json(responseData);
        return;
      }
      const responseData: ResponseData = {
        statusCode: 200,
        message: "Sign in successful",
        data: {
          player_id: storedPlayerData.player_id,
          player_name: storedPlayerData.player_name,
          email: storedPlayerData.email,
        },
      };
      req.session.playerData = responseData.data;
      res.status(responseData.statusCode).json(responseData);
    } else {
      res.json(result.array({ onlyFirstError: true }));
    }
  } catch (error) {
    next(error);
  }
};

export const handelVerification = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const playerSessionData: PlayerSessionData | undefined =
      req.session.playerData;
    if (playerSessionData) {
      const responseData: ResponseData = {
        statusCode: 200,
        message: "Player is authenticated",
        data: playerSessionData,
      };
      res.status(responseData.statusCode).json(responseData);
    } else {
      next(new AppError("Player is not authenticated", 401));
    }
  } catch (error) {
    next(new AppError("Internal server error", 500));
  }
};
