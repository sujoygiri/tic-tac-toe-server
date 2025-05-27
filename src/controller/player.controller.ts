import { Request, Response, NextFunction } from "express";
import { matchedData, validationResult } from "express-validator";

import * as db from "../db/init.db";
import { AppError } from "../utils/errorHandler.util";
import { ResponseData } from "../types/global.type";

type Player = {
  id: string;
  name: string;
};

const DB_SCHEMA: string = process.env.DB_SCHEMA ?? "primary";

class Queue<T> {
  private player: T[] = [];

  enqueue(item: T): void {
    this.player.push(item);
  }

  dequeue(): T | undefined {
    return this.player.shift();
  }

  peek(): T | undefined {
    return this.player[0];
  }

  isEmpty(): boolean {
    return this.player.length === 0;
  }

  size(): number {
    return this.player.length;
  }

  traverse(callback: (item: T) => void): void {
    this.player.forEach(callback);
  }
}

export const joinInQueuePlayer = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const playerQueue = new Queue<Player>();
  const player1 = {
    id: "1234",
    name: "Joy",
  };
  playerQueue.enqueue(player1);
  playerQueue.traverse((player) => {
    console.log(player); // Replace with desired logic for each player
  });
  res.json(playerQueue);
};

export const findPlayerById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = validationResult(req);
    if (result.isEmpty()) {
      const playerData = matchedData<{ playerId: string }>(req, {
        onlyValidData: true,
      });
      const findPlayerByIdQuery = `SELECT player_id,player_name,email FROM ${DB_SCHEMA}.player WHERE player.player_id = $1`;
      const findPlayerByIdQueryResult = await db.query(findPlayerByIdQuery, [
        playerData.playerId,
      ]);
      if (findPlayerByIdQueryResult.rows.length) {
        const responseData: ResponseData = {
          statusCode: 200,
          message: "Player found",
          data: findPlayerByIdQueryResult.rows[0],
        };
        res.status(responseData.statusCode).json(responseData);
      } else {
        next(new AppError("Player not found", 404));
      }
    } else {
      next(new AppError(result.array({ onlyFirstError: true })[0].msg, 400));
    }
  } catch (error) {
    next(error);
  }
};
