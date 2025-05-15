import { Request, Response, NextFunction } from "express";

import { PlayerSessionData } from "../types/global.type";
import { AppError } from "../utils/errorHandler.util";

export const checkAuthorization = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const playerData: PlayerSessionData | undefined = req.session.playerData;
    if (playerData && playerData.player_id) {
      next();
    } else {
      const error = new AppError(
        "Authorization failed: Player session not found or invalid.",
        401
      );
      error.statusCode = 401;
      next(error);
    }
  } catch (error) {
    console.log({ file: module.filename, error });
    error = new Error("Internal server error");
    next(error);
  }
};
